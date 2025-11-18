import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { currentUser } from '@clerk/nextjs/server';
import {
  AppError,
  ValidationError,
  RateLimitError,
  ExternalServiceError,
  ErrorHandler,
  ErrorCodes,
  ErrorTypes,
  createRequestContext
} from '@/lib/errors';
import { logger, createLogContext, measurePerformance, LogCategory } from '@/lib/logger';
import { requestDemoAccess } from '@/app/actions/demo-requests';

// Rate limiting for waitlist requests
interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  blockUntil?: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
      blocked: false,
    });
    return { allowed: true };
  }

  // Reset if 1 hour has passed
  if (now - entry.firstRequest > 3600000) {
    rateLimitMap.set(ip, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
      blocked: false,
    });
    return { allowed: true };
  }

  // Block if already blocked and time hasn't passed
  if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
    return { allowed: false, resetTime: entry.blockUntil };
  }

  // Reset block if time has passed
  if (entry.blocked && entry.blockUntil && now >= entry.blockUntil) {
    entry.blocked = false;
    entry.count = 0;
    entry.firstRequest = now;
  }

  // Allow up to 3 requests per hour
  if (entry.count >= 3) {
    entry.blocked = true;
    entry.blockUntil = now + 3600000; // Block for 1 hour
    rateLimitMap.set(ip, entry);
    return { allowed: false, resetTime: entry.blockUntil };
  }

  entry.count++;
  entry.lastRequest = now;
  rateLimitMap.set(ip, entry);
  return { allowed: true };
}

function validateEnvironment(): void {
  // Las variables SMTP son opcionales - el email es secundario
  // La solicitud se guarda de todas formas en el sistema
  return;
}

async function sendWaitlistEmail(
  clientName: string,
  clientEmail: string,
  demoName: string,
  demoId: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    }
  });

  try {
    await transporter.verify();
  } catch {
    throw new ExternalServiceError('SMTP server configuration is invalid');
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    subject: `[Lista de Espera] Cliente quiere apuntarse a demo: ${demoName}`,
    text: `
Un cliente quiere apuntarse a la lista de espera para una demo en desarrollo.

Cliente: ${clientName}
Email: ${clientEmail}
Demo: ${demoName}
ID Demo: ${demoId}

Por favor, contacta con el cliente para informarle sobre el estado de la demo y cuándo estará disponible.
    `.trim(),
    html: `
<h3>Nueva Solicitud de Lista de Espera</h3>
<p>Un cliente quiere apuntarse a la lista de espera para una demo en desarrollo.</p>
<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
<p><strong>Cliente:</strong> ${clientName}</p>
<p><strong>Email:</strong> ${clientEmail}</p>
<p><strong>Demo:</strong> ${demoName}</p>
<p><strong>ID Demo:</strong> ${demoId}</p>
<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
<p style="color: #666;">Por favor, contacta con el cliente para informarle sobre el estado de la demo y cuándo estará disponible.</p>
    `.trim()
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    throw new ExternalServiceError(
      `Failed to send email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestContext = createRequestContext(request);
  const logContext = createLogContext(request);

  try {
    logger.info('Waitlist request received', LogCategory.API, logContext);

    validateEnvironment();

    // Get authenticated user
    const user = await currentUser();
    if (!user) {
      throw new ValidationError('User must be authenticated', requestContext);
    }

    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Rate limiting
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      logger.rateLimitExceeded(logContext, {
        ip: clientIP,
        resetTime: rateLimitResult.resetTime
      });
      const resetTime = rateLimitResult.resetTime
        ? new Date(rateLimitResult.resetTime).toISOString()
        : 'unknown';
      throw new RateLimitError(
        `Rate limit exceeded. ${resetTime !== 'unknown' ? `Try again after ${resetTime}` : 'Please try again later.'}`
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON in request body', requestContext);
    }

    const { demoId, demoName } = body;

    if (!demoId || !demoName) {
      throw new ValidationError('demoId and demoName are required', requestContext);
    }

    const clientName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Usuario';
    const clientEmail = user.emailAddresses[0]?.emailAddress || 'unknown@example.com';

    // Crear solicitud en el sistema de requests para que aparezca en admin
    const requestResult = await requestDemoAccess(
      demoId,
      demoName,
      '🕐 Lista de espera: El cliente quiere apuntarse a esta demo en desarrollo.'
    );

    if (!requestResult.success) {
      // Si ya existe una solicitud pendiente, está bien, continuar con el email
      logger.info('Demo request creation info', LogCategory.API, {
        ...logContext,
        reason: requestResult.error
      });
    }

    // Send email notification (optional, puede fallar sin afectar la solicitud)
    try {
      await measurePerformance(
        'send-waitlist-email',
        () => sendWaitlistEmail(clientName, clientEmail, demoName, demoId),
        logContext
      );
    } catch (emailError) {
      // Log pero no fallar si el email falla
      logger.error('Email notification failed but request was saved', LogCategory.API, {
        ...logContext,
        error: emailError instanceof Error ? emailError.message : 'Unknown'
      });
    }

    const duration = Date.now() - startTime;
    logger.business('Waitlist request submitted successfully', logContext, {
      clientEmail,
      demoId,
      demoName,
      duration,
      requestId: requestResult.requestId
    });

    logger.apiRequest(request.method, new URL(request.url).pathname, 200, duration, logContext);

    return NextResponse.json({
      success: true,
      message: 'Te has apuntado a la lista de espera. Un administrador revisará tu solicitud.'
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    return ErrorHandler.handle(error, requestContext, logContext, duration);
  }
}

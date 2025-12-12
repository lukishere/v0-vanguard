import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
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
import { InputValidator } from '@/lib/validation';

/*
  CONTACT/QUOTE EMAIL API ROUTE
  -----------------------------------
  This route handles POST requests from the website contact/quote form and sends an email to contacto@vanguard-ia.tech using Nodemailer and Open-Xchange SMTP.

  ENVIRONMENT VARIABLES (set in .env.local):
    SMTP_HOST   = smtp.openxchange.eu         # Your Open-Xchange SMTP server
    SMTP_PORT   = 587                         # 587 for TLS/STARTTLS, 465 for SSL
    SMTP_USER   = yourname@yourdomain.com     # Your full email address
    SMTP_PASS   = your_email_password         # Your email password or app password

  BEST PRACTICES:
    - Never commit .env.local to version control.
    - Update SMTP credentials if you change your email password or provider.
    - Use environment variables for all sensitive data.
    - Restart your server after changing environment variables.
    - Log errors for debugging, but avoid exposing sensitive info to users.
    - Test with your provider's recommended settings (host, port, security).

  CODE HIGHLIGHTS:
    - Uses 'secure: true' for port 465 (SSL), 'secure: false' for 587 (TLS).
    - Handles errors gracefully and returns JSON responses.
    - Formats both plain text and HTML email bodies.
    - Input validation with Zod schema
    - Rate limiting protection
    - HTML sanitization

  For more info, see: https://www.openxchange.eu/
*/

// Legacy Zod schema - replaced by enhanced validation system
// Keeping for reference but not used in current implementation

// Enhanced rate limiting with more sophisticated tracking
interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  blockUntil?: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_BLOCK_DURATION = 60 * 60 * 1000; // 1 hour block after exceeding

// reCAPTCHA Enterprise configuration
const RECAPTCHA_PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_ACTION = 'submit_contact_form';

// Enhanced HTML sanitization
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
}

// Advanced rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
      blocked: false
    });
    return { allowed: true };
  }

  // Check if currently blocked
  if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
    return { allowed: false, resetTime: entry.blockUntil };
  }

  // Reset if window has passed
  if (now - entry.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
      blocked: false
    });
    return { allowed: true };
  }

  // Increment counter
  entry.count++;
  entry.lastRequest = now;

  // Check if limit exceeded
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    entry.blocked = true;
    entry.blockUntil = now + RATE_LIMIT_BLOCK_DURATION;
    return { allowed: false, resetTime: entry.blockUntil };
  }

  return { allowed: true };
}

// Environment validation with detailed error messages
function validateEnvironment(): void {
  const requiredVars = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'CONTACT_EMAIL',
    'RECAPTCHA_SECRET_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new AppError(
      'ConfigurationError',
      ErrorCodes.INTERNAL_SERVER_ERROR,
      ErrorTypes.CONFIGURATION_ERROR,
      `Missing required environment variables: ${missing.join(', ')}`,
      false
    );
  }
}

// Enhanced email sending with better error handling
async function sendEmail(name: string, email: string, message: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Additional security options
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    }
  });

  // Verify transporter configuration
  try {
    await transporter.verify();
  } catch {
    throw new ExternalServiceError('SMTP server configuration is invalid');
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    subject: `Contact Form Submission from ${sanitizeInput(name)}`,
    text: `
Name: ${sanitizeInput(name)}
Email: ${email}
Message: ${sanitizeInput(message)}
    `.trim(),
    html: `
<h3>Contact Form Submission</h3>
<p><strong>Name:</strong> ${sanitizeInput(name)}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${sanitizeInput(message).replace(/\n/g, '<br>')}</p>
    `.trim()
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (emailError) {
    throw new ExternalServiceError(`Failed to send email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
  }
}

type RecaptchaVerificationResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  score?: number;
  action?: string;
};

/**
 * Create an assessment using Google Cloud reCAPTCHA Enterprise SDK
 * This provides better integration and more detailed risk analysis
 */
async function verifyRecaptchaToken(token: string, remoteIp?: string): Promise<RecaptchaVerificationResponse> {
  // Try SDK method first if PROJECT_ID is configured
  if (RECAPTCHA_PROJECT_ID && RECAPTCHA_SITE_KEY) {
    try {
      // Create the reCAPTCHA Enterprise client
      const client = new RecaptchaEnterpriseServiceClient();
      const projectPath = client.projectPath(RECAPTCHA_PROJECT_ID);

      // Build the assessment request
      const request = {
        assessment: {
          event: {
            token: token,
            siteKey: RECAPTCHA_SITE_KEY,
          },
        },
        parent: projectPath,
      };

      const [response] = await client.createAssessment(request);

      // Check if the token is valid
      if (!response.tokenProperties?.valid) {
        const invalidReason = response.tokenProperties?.invalidReason || 'UNKNOWN';
        logger.warn('reCAPTCHA token invalid', LogCategory.API, {}, {
          invalidReason,
          token: token.substring(0, 20) + '...'
        });

        return {
          success: false,
          'error-codes': [invalidReason],
          score: 0,
        };
      }

      // Check if the expected action was executed
      if (response.tokenProperties.action !== RECAPTCHA_ACTION) {
        logger.warn('reCAPTCHA action mismatch', LogCategory.API, {}, {
          expected: RECAPTCHA_ACTION,
          received: response.tokenProperties.action
        });

        return {
          success: false,
          'error-codes': ['ACTION_MISMATCH'],
          score: 0,
        };
      }

      // Get the risk score
      const score = response.riskAnalysis?.score ?? 0;
      const reasons = response.riskAnalysis?.reasons || [];

      if (reasons.length > 0) {
        logger.info('reCAPTCHA risk analysis reasons', LogCategory.API, {}, {
          score,
          reasons: reasons.map(r => r.toString())
        });
      }

      return {
        success: true,
        score,
        action: response.tokenProperties.action,
      };
    } catch (error) {
      logger.warn('reCAPTCHA Enterprise SDK failed, falling back to HTTP', LogCategory.API, {}, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      // Fall through to HTTP method
    }
  }

  // Fallback to HTTP method
  return await verifyRecaptchaTokenHttp(token, remoteIp);
}

/**
 * Fallback HTTP method for reCAPTCHA verification
 * Used if SDK is not configured or fails
 */
async function verifyRecaptchaTokenHttp(token: string, remoteIp?: string): Promise<RecaptchaVerificationResponse> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new AppError(
      'ConfigurationError',
      ErrorCodes.INTERNAL_SERVER_ERROR,
      ErrorTypes.CONFIGURATION_ERROR,
      'Missing RECAPTCHA_SECRET_KEY environment variable (fallback method)',
      false
    );
  }

  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  let response: Response;
  try {
    response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      body: formData
    });
  } catch (networkError) {
    throw new ExternalServiceError(`Failed to contact captcha verification service: ${networkError instanceof Error ? networkError.message : 'Unknown error'}`);
  }

  if (!response.ok) {
    throw new ExternalServiceError(`Captcha verification service responded with status ${response.status}`);
  }

  try {
    return await response.json() as RecaptchaVerificationResponse;
  } catch {
    throw new ExternalServiceError('Captcha verification service returned an invalid response');
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestContext = createRequestContext(request);
  const logContext = createLogContext(request);

  try {
    // Log incoming request
    logger.info('Contact form submission received', LogCategory.API, logContext);

    // Validate environment
    validateEnvironment();

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON in request body', requestContext);
    }

    // Basic honeypot check for spam bots
    if (typeof body?.honeypot === 'string' && body.honeypot.trim().length > 0) {
      logger.warn('Honeypot field detected, likely bot submission', LogCategory.API, logContext);
      throw new ValidationError('Invalid submission detected', requestContext);
    }

    // Enhanced validation using our custom validator
    const validationResult = InputValidator.validateContactForm(body);
    if (!validationResult.isValid) {
      const errorMessages = Object.entries(validationResult.errors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('; ');

      logger.warn(`Enhanced validation failed: ${errorMessages}`, LogCategory.API, logContext, {
        validationErrors: validationResult.errors
      });

      throw new ValidationError(`Validation failed: ${errorMessages}`, requestContext);
    }

    const sanitizedData = validationResult.sanitizedData;
    if (!sanitizedData) {
      throw new ValidationError('Unable to process contact data', requestContext);
    }

    const { name, email, message, captchaToken } = sanitizedData;

    // Enhanced rate limiting
    const clientIP = requestContext.ip || 'unknown';
    const rateLimitResult = checkRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      logger.rateLimitExceeded(logContext, {
        ip: clientIP,
        resetTime: rateLimitResult.resetTime
      });

      const resetTime = rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toISOString() : 'unknown';
      throw new RateLimitError(`Rate limit exceeded. ${resetTime ? `Try again after ${resetTime}` : 'Please try again later.'}`);
    }

    // Verify reCAPTCHA v3 token
    // In development, allow submission without token if it's empty
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!captchaToken && !isDevelopment) {
      logger.warn('Captcha token missing in production', LogCategory.API, logContext);
      throw new ValidationError(
        'Captcha verification required',
        requestContext
      );
    }

    if (captchaToken) {
      const remoteIp = clientIP === 'unknown' ? undefined : clientIP;
      const captchaVerification = await verifyRecaptchaToken(captchaToken, remoteIp);
      if (!captchaVerification.success) {
        logger.warn('Captcha verification failed', LogCategory.API, logContext, {
          captchaErrors: captchaVerification['error-codes'] ?? []
        });
        throw new ValidationError(
          `Captcha verification failed${captchaVerification['error-codes']?.length ? `: ${captchaVerification['error-codes']?.join(', ')}` : ''}`,
          requestContext
        );
      }

      // Verify score (reCAPTCHA v3 returns a score from 0.0 to 1.0)
      // Lower scores indicate higher risk. Typically, scores below 0.5 are considered suspicious
      const score = captchaVerification.score ?? 0;
      if (score < 0.5) {
        logger.warn('Captcha score too low', LogCategory.API, logContext, {
          score,
          action: captchaVerification.action
        });
        throw new ValidationError(
          'Captcha verification failed: Low security score',
          requestContext
        );
      }
    } else {
      // Development mode: log warning but allow submission
      logger.warn('Skipping captcha verification in development mode', LogCategory.API, logContext);
    }

    // Send email with performance measurement
    await measurePerformance(
      'send-contact-email',
      () => sendEmail(name, email, message),
      logContext
    );

    // Log successful submission
    const duration = Date.now() - startTime;
    logger.business('Contact form submitted successfully', logContext, {
      senderEmail: email,
      duration
    });

    logger.apiRequest(request.method, new URL(request.url).pathname, 200, duration, logContext);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const appError = ErrorHandler.handleError(error as Error, requestContext);

    // Log the error
    ErrorHandler.logError(appError);

    // Log API response
    logger.apiRequest(
      request.method,
      new URL(request.url).pathname,
      appError.httpCode,
      duration,
      logContext
    );

    // Return appropriate error response
    const errorResponse = ErrorHandler.createErrorResponse(appError, process.env.NODE_ENV === 'development');

    return NextResponse.json(errorResponse, {
      status: appError.httpCode
    });
  }
}

// Handle unsupported methods
export async function GET() {
  const error = new AppError(
    'MethodNotAllowed',
    ErrorCodes.METHOD_NOT_ALLOWED,
    ErrorTypes.BUSINESS_LOGIC_ERROR,
    'GET method not allowed for this endpoint',
    true
  );

  const errorResponse = ErrorHandler.createErrorResponse(error);
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function PUT() {
  const error = new AppError(
    'MethodNotAllowed',
    ErrorCodes.METHOD_NOT_ALLOWED,
    ErrorTypes.BUSINESS_LOGIC_ERROR,
    'PUT method not allowed for this endpoint',
    true
  );

  const errorResponse = ErrorHandler.createErrorResponse(error);
  return NextResponse.json(errorResponse, { status: 405 });
}

export async function DELETE() {
  const error = new AppError(
    'MethodNotAllowed',
    ErrorCodes.METHOD_NOT_ALLOWED,
    ErrorTypes.BUSINESS_LOGIC_ERROR,
    'DELETE method not allowed for this endpoint',
    true
  );

  const errorResponse = ErrorHandler.createErrorResponse(error);
  return NextResponse.json(errorResponse, { status: 405 });
}

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simple validation
function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendAuditEmail(
  name: string,
  email: string,
  phone: string,
  position: string,
  company: string,
  sector: string,
  message: string
): Promise<void> {
  // Validate environment variables with specific messages
  const missingVars: string[] = [];
  if (!process.env.SMTP_HOST) missingVars.push('SMTP_HOST');
  if (!process.env.SMTP_USER) missingVars.push('SMTP_USER');
  if (!process.env.SMTP_PASS) missingVars.push('SMTP_PASS');

  if (missingVars.length > 0) {
    console.error('SMTP configuration missing:', missingVars.join(', '));
    throw new Error(`SMTP configuration is missing: ${missingVars.join(', ')}`);
  }

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

  // Verify transporter configuration with detailed error
  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error('SMTP verification failed:', verifyError);
    const errorMessage = verifyError instanceof Error ? verifyError.message : 'Unknown SMTP error';
    throw new Error(`SMTP server configuration is invalid: ${errorMessage}`);
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'contacto@vanguard-ia.tech',
    subject: `Technical Audit Request from ${sanitizeInput(name)}`,
    text: `
Technical Audit Request

Name: ${sanitizeInput(name)}
Email: ${email}
Phone: ${sanitizeInput(phone)}
Position: ${sanitizeInput(position) || 'Not provided'}
Company: ${sanitizeInput(company) || 'Not provided'}
Sector: ${sanitizeInput(sector) || 'Not provided'}
Message: ${sanitizeInput(message)}

---
This request was submitted through the VANGUARD-IA website.
    `.trim(),
    html: `
<h3>Technical Audit Request</h3>
<p><strong>Name:</strong> ${sanitizeInput(name)}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${sanitizeInput(phone)}</p>
<p><strong>Position:</strong> ${sanitizeInput(position) || 'Not provided'}</p>
<p><strong>Company:</strong> ${sanitizeInput(company) || 'Not provided'}</p>
<p><strong>Sector:</strong> ${sanitizeInput(sector) || 'Not provided'}</p>
<p><strong>Message:</strong></p>
<p>${sanitizeInput(message).replace(/\n/g, '<br>')}</p>
<hr>
<p style="color: #666; font-size: 12px;">This request was submitted through the VANGUARD-IA website.</p>
    `.trim()
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Audit request email sent successfully to:', mailOptions.to);
  } catch (emailError) {
    console.error('Failed to send audit request email:', emailError);
    const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown error';

    // Provide more specific error messages based on common SMTP errors
    if (errorMessage.includes('Invalid login')) {
      throw new Error('SMTP authentication failed. Please check SMTP credentials.');
    } else if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ETIMEDOUT')) {
      throw new Error('Cannot connect to SMTP server. Please check SMTP host and port.');
    } else if (errorMessage.includes('certificate')) {
      throw new Error('SMTP certificate verification failed.');
    }

    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, position, company, sector, message } = body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        { error: 'Phone is required' },
        { status: 400 }
      );
    }

    // Send email
    await sendAuditEmail(
      name.trim(),
      email.trim(),
      phone.trim(),
      position?.trim() || '',
      company?.trim() || '',
      sector?.trim() || '',
      message?.trim() || 'Technical audit request'
    );

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending audit request email:', error);

    // Extract error message
    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to send email. Please try again later.';

    // Return more specific error message to client
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

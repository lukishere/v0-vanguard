import nodemailer from 'nodemailer';

/*
  CONTACT/QUOTE EMAIL API ROUTE
  -----------------------------------
  This route handles POST requests from the website contact/quote form and sends an email to sales@vanguard-ia.tech using Nodemailer and Open-Xchange SMTP.

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

  For more info, see: https://www.openxchange.eu/
*/

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Configure your SMTP transporter (replace with your real credentials)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Vanguard Website" <${process.env.SMTP_USER}>`,
      to: 'sales@vanguard-ia.tech',
      subject: 'New Quote Request from Website',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 
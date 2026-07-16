// lib/email.ts
import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${appUrl}/api/verify-email?token=${token}`;

  // 1. Gather SMTP Environment Variables
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || `"E-Shop Support" <no-reply@yourdomain.com>`;

  // 2. Safety Guard against missing setup variables
  if (!host || !user || !pass) {
    console.error("❌ SMTP Environment Variables (SMTP_HOST, SMTP_USER, or SMTP_PASSWORD) are missing!");
    throw new Error("SMTP credentials are not configured in your .env.local file.");
  }

  // 3. Create SMTP Transporter
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Use SSL for port 465, TLS/STARTTLS for port 587
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false, // Prevents certificate blockages in local environments
    },
  });

  // 4. Send Email
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Welcome to E-Shop, ${name}!</h2>
          <p>Thank you for signing up. Please verify your email address to secure your account and start shopping.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #4f46e5; word-break: break-all;">${verificationUrl}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 11px; color: #94a3b8;">This link will expire in 24 hours. If you did not sign up for this account, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`✅ SMTP verification email successfully sent to: ${email}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown SMTP error";
    console.error("❌ SMTP email delivery failed:", message);
    throw new Error(`Could not send SMTP verification email: ${message}`);
  }
}
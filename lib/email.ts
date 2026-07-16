
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Resend's free default sender address
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
    console.log(`Verification email successfully sent to: ${email}`);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Could not send verification email.");
  }
}
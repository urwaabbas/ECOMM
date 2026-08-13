import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are not configured in your .env file.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

function otpEmailTemplate(title: string, name: string, otp: string, note: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #4f46e5; margin-bottom: 8px;">${title}</h2>
      <p style="color: #334155;">Hi ${name},</p>
      <p style="color: #334155;">${note}</p>
      <div style="margin: 32px 0; text-align: center;">
        <div style="display: inline-block; background: #f1f5f9; border: 1px dashed #94a3b8; border-radius: 10px; padding: 20px 40px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #4f46e5;">${otp}</span>
        </div>
      </div>
      <p style="color: #64748b; font-size: 13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8;">If you did not request this, please ignore this email. Your account is safe.</p>
      <p style="font-size: 11px; color: #94a3b8;">— Haanli Bazaar Team</p>
    </div>
  `;
}

export async function sendVerificationOtp(email: string, otp: string, name: string) {
  const from = process.env.SMTP_FROM || '"Haanli Bazaar" <no-reply@haanlibazaar.com>';
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Your Haanli Bazaar verification code",
      html: otpEmailTemplate(
        "Verify your email",
        name,
        otp,
        "Use the code below to verify your email address and complete your registration."
      ),
    });
    console.log(`✅ Verification OTP sent to: ${email}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Failed to send verification OTP:", message);
    throw new Error(`Could not send verification OTP: ${message}`);
  }
}

export async function sendPasswordResetOtp(email: string, otp: string, name: string) {
  const from = process.env.SMTP_FROM || '"Haanli Bazaar" <no-reply@haanlibazaar.com>';
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Your Haanli Bazaar password reset code",
      html: otpEmailTemplate(
        "Reset your password",
        name,
        otp,
        "Use the code below to reset your password. If you did not request this, ignore this email."
      ),
    });
    console.log(`✅ Password reset OTP sent to: ${email}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Failed to send reset OTP:", message);
    throw new Error(`Could not send reset OTP: ${message}`);
  }
}
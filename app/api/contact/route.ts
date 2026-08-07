import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDB();
    await Contact.create({ name, email, message });

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM || `"Haanli Bazaar" <no-reply@haanlibazaar.com>`;

    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from,
        to: user,
        subject: `New Contact Message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #4f46e5;">New Contact Message</h2>
            <p>You have received a new message from the Haanli Bazaar contact form.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #374151; background: #f9fafb; border: 1px solid #e5e7eb; width: 30%;">Name</td>
                <td style="padding: 10px; color: #374151; border: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #374151; background: #f9fafb; border: 1px solid #e5e7eb;">Email</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                  <a href="mailto:${email}" style="color: #4f46e5;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #374151; background: #f9fafb; border: 1px solid #e5e7eb;">Message</td>
                <td style="padding: 10px; color: #374151; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <p style="font-size: 12px; color: #94a3b8;">This message was sent from haanlibazaar.vercel.app</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/lib/db";
import Newsletter from "@/models/Newsletter";
import nodemailer from "nodemailer";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if ((session.user as any).role !== "admin") {
    return { session: null, error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
  }
  return { session, error: null };
}

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    await connectDB();
    const subscribers = await Newsletter.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, subscribers });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    await connectDB();
    const subscribers = await Newsletter.find().lean();

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM || `"Haanli Bazaar" <no-reply@haanlibazaar.com>`;

    if (!host || !user || !pass) {
      return NextResponse.json({ error: "SMTP not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });

    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      try {
        await transporter.sendMail({
          from,
          to: subscriber.email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 0;">
              <div style="background: #4f46e5; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 800;">Haanli Bazaar</h1>
              </div>
              <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none;">
                <h2 style="color: #111827; font-size: 18px; font-weight: 700; margin-top: 0;">${subject}</h2>
                <div style="color: #374151; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</div>
                <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <a href="https://haanlibazaar.vercel.app/products" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    Shop Now
                  </a>
                </div>
              </div>
              <div style="background: #f9fafb; padding: 16px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                  You are receiving this email because you subscribed to Haanli Bazaar newsletters.
                </p>
              </div>
            </div>
          `,
        });
        sentCount++;
      } catch {
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
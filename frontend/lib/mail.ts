import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);

const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFromEmail = process.env.SMTP_FROM_EMAIL;

console.log("🔍 SMTP DEBUG:", {
  host: smtpHost,
  port: smtpPort,
  user: smtpUser,
  passwordExists: !!smtpPassword,
  passwordLength: smtpPassword?.length,
  from: smtpFromEmail,
});

if (!smtpHost || !smtpUser || !smtpPassword || !smtpFromEmail) {
  console.error("❌ SMTP configuration is incomplete.");

  console.error({
    SMTP_HOST: !!smtpHost,
    SMTP_PORT: smtpPort,
    SMTP_USER: !!smtpUser,
    SMTP_PASSWORD: !!smtpPassword,
    SMTP_FROM_EMAIL: !!smtpFromEmail,
  });

  throw new Error("SMTP configuration is incomplete");
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,

  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationCode: string
) {
  try {
    console.log("📧 Sending verification email to:", email);

    await transporter.verify();

    console.log("✅ SMTP authentication successful");

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "PrepMaster"}" <${smtpFromEmail}>`,
      to: email,
      subject: "Verify your PrepMaster account",

      text: `Hello ${name},

Your PrepMaster verification code is:

${verificationCode}

This code will expire in 5 minutes.

If you did not create a PrepMaster account, you can safely ignore this email.

Regards,
PrepMaster Team`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          <h2>Welcome to PrepMaster 👋</h2>

          <p>Hello ${name},</p>

          <p>Use the verification code below to verify your email address:</p>

          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px;">
            ${verificationCode}
          </div>

          <p>This code will expire in <strong>5 minutes</strong>.</p>

          <p style="color: #666;">
            If you did not create a PrepMaster account, you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            <strong>PrepMaster Team</strong>
          </p>
        </div>
      `,
    });

    console.log("✅ Verification email sent successfully.");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
}
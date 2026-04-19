import nodemailer from 'nodemailer';

export async function sendEmail(options: { to: string; subject: string; text: string; html?: string }): Promise<{ sent: boolean; reason?: string } | void> {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;

  if (!host || !port || !user || !pass) {
    const missing = ['host', 'port', 'user', 'pass'].filter(k => !({ host, port, user, pass }[k]));
    console.warn(`[Email] SMTP configuration incomplete. Missing: ${missing.join(', ')}. Email was NOT sent.`);
    return { sent: false, reason: `SMTP config incomplete — missing: ${missing.join(', ')}` };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  return { sent: true };
}

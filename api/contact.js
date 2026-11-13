import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 12 * 1024;
const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!req.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json." });
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request body is too large." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  if (typeof body.company === "string" && body.company.trim()) {
    return res.status(200).json({ success: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim().replace(/[\r\n]+/g, " ") : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !name ||
    name.length > 100 ||
    !EMAIL_RE.test(email) ||
    email.length > 254 ||
    subject.length > 140 ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return res.status(400).json({ error: "Please provide valid contact details and a message." });
  }

  const { SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
  const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
  if (!SMTP_USER || !SMTP_PASS || !CONTACT_TO || !Number.isInteger(SMTP_PORT) || SMTP_PORT < 1 || SMTP_PORT > 65535) {
    console.error("Contact email is not configured. Set SMTP_USER, SMTP_PASS, CONTACT_TO, and a valid SMTP_PORT.");
    return res.status(503).json({ error: "Email service is not configured." });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const mailSubject = subject || `Portfolio contact from ${name}`;

  try {
    await transporter.sendMail({
      from: `"Portfolio contact" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: mailSubject,
      text: `${message}\n\n— ${name} (${email})`,
      html: `<p>${safeMessage}</p><p>— ${safeName} (&lt;${safeEmail}&gt;)</p>`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact email delivery failed:", error);
    return res.status(502).json({ error: "Could not send your message. Please try again later." });
  }
}

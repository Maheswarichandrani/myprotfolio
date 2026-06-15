import { Resend } from "resend";

/**
 * Contact form endpoint. Sends an email via Resend.
 *
 * Required env (add when ready):
 *   RESEND_API_KEY    — your Resend API key
 *   CONTACT_TO_EMAIL  — inbox that receives messages (defaults to mine)
 *   CONTACT_FROM_EMAIL— verified sender (defaults to Resend's test sender)
 */

const TO = process.env.CONTACT_TO_EMAIL || "chandranimaheswari13@gmail.com";
// `onboarding@resend.dev` works out of the box; swap for a verified domain later.
const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clamp = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 200);
  const message = clamp(body.message, 5000);

  // Honeypot — bots fill hidden fields; humans don't.
  if (clamp(body.company, 100)) {
    return Response.json({ ok: true });
  }

  if (!name || !email || !message) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Key not configured yet — fail loud server-side, soft client-side.
    console.error("RESEND_API_KEY is not set; cannot send contact email.");
    return Response.json(
      { error: "Email service is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Portfolio contact — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send message." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

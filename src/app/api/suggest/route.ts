import { NextRequest, NextResponse } from "next/server";

const SUPPORT_EMAIL = "paul@pauleident.com";

export async function POST(req: NextRequest) {
  try {
    const { name, email, category, feature, problem } = await req.json();

    if (!name || !email || !category || !feature) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Length limits
    if (name.length > 200 || email.length > 200 || category.length > 100 || feature.length > 5000 || (problem && problem.length > 5000)) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    const emailText = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Category: ${category}`,
      ``,
      `Feature Request:`,
      feature,
      ``,
      problem ? `Problem / Use Case:\n${problem}` : "(No problem description provided)",
    ].join("\n");

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Volntir Features <noreply@volntir.com>",
          to: SUPPORT_EMAIL,
          reply_to: email,
          subject: `[Volntir Feature] ${category}: ${feature.slice(0, 80)}`,
          text: emailText,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("Resend error:", body);
        return NextResponse.json({ error: "Failed to send suggestion" }, { status: 500 });
      }
    } else {
      console.log("--- FEATURE SUGGESTION (Resend not configured) ---");
      console.log(emailText);
      console.log("--- END ---");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

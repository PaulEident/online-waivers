import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, category, feature, problem, willingToPay, monthlyBudget } = await req.json();

    if (!name || !email || !category || !feature) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (name.length > 200 || email.length > 200 || category.length > 100 || feature.length > 5000 || (problem && problem.length > 5000)) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    await prisma.featureRequest.create({
      data: {
        name,
        email,
        category,
        feature,
        problem: problem || null,
        willingToPay: willingToPay || null,
        monthlyBudget: monthlyBudget || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

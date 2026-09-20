import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import {
  generateVerificationCode,
  hashVerificationCode,
  getVerificationExpiry,
} from "@/lib/auth/verification";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  console.log("🔥 1. SIGNUP API HIT");

  try {
    const body = await request.json();

    console.log("🔥 2. BODY RECEIVED");

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    console.log("🔥 3. DATA PARSED", {
      name,
      email,
      passwordReceived: !!password,
      passwordLength: password.length,
    });

    if (!name || !email || !password) {
      console.log("❌ Missing field");

      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 50) {
      console.log("❌ Invalid name");

      return NextResponse.json(
        { error: "Name must be between 2 and 50 characters." },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 128) {
      console.log("❌ Invalid password length");

      return NextResponse.json(
        { error: "Password must be between 8 and 128 characters." },
        { status: 400 }
      );
    }

    console.log("🔥 4. VALIDATION PASSED");

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    console.log("🔥 5. USER CHECK DONE");

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to create account with these details." },
        { status: 409 }
      );
    }

    const passwordHash = await argon2.hash(password);

    console.log("🔥 6. PASSWORD HASHED");

    const verificationCode = generateVerificationCode();
    const codeHash = hashVerificationCode(verificationCode);

    console.log("🔥 7. OTP GENERATED");

    await prisma.emailVerification.upsert({
      where: {
        email,
      },
      update: {
        name,
        passwordHash,
        codeHash,
        expiresAt: getVerificationExpiry(),
        attempts: 0,
      },
      create: {
        email,
        name,
        passwordHash,
        codeHash,
        expiresAt: getVerificationExpiry(),
        attempts: 0,
      },
    });

    console.log("🔥 8. VERIFICATION SAVED");

    await sendVerificationEmail(
      email,
      name,
      verificationCode
    );

    console.log("🔥 9. EMAIL SENT");

    return NextResponse.json(
      {
        message: "Verification code sent to your email.",
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ SIGNUP ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
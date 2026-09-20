import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCode } from "@/lib/auth/verification";

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        {
          error: "Email and verification code are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          error: "Verification code must be 6 digits.",
        },
        { status: 400 }
      );
    }

    // Find pending verification
    const verification =
      await prisma.emailVerification.findUnique({
        where: { email },
      });

    if (!verification) {
      return NextResponse.json(
        {
          error: "Verification request not found or expired.",
        },
        { status: 404 }
      );
    }

    // Check maximum attempts
    if (verification.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error:
            "Too many incorrect attempts. Please request a new code.",
        },
        { status: 429 }
      );
    }

    // Check expiry
    if (verification.expiresAt.getTime() < Date.now()) {
      await prisma.emailVerification.delete({
        where: { id: verification.id },
      });

      return NextResponse.json(
        {
          error: "Verification code has expired. Please request a new code.",
        },
        { status: 410 }
      );
    }

    // Verify code
    const isValid = verifyCode(
      code,
      verification.codeHash
    );

    if (!isValid) {
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        {
          error: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    // Double-check that the account wasn't created meanwhile
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      await prisma.emailVerification.delete({
        where: { id: verification.id },
      });

      return NextResponse.json(
        {
          error: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Create verified user
    const user = await prisma.user.create({
      data: {
        name: verification.name,
        email: verification.email,
        passwordHash: verification.passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Remove verification record after successful verification
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    });

    return NextResponse.json(
      {
        message: "Email verified and account created successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
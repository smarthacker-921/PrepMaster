import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  console.log("🔥 LOGIN API HIT");

  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    console.log("🔥 LOGIN DATA RECEIVED", {
      email,
      passwordReceived: !!password,
    });

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      console.log("❌ USER NOT FOUND");

      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    console.log("🔥 USER FOUND");

    let passwordValid = false;

    try {
      passwordValid = await argon2.verify(
        user.passwordHash,
        password
      );
    } catch (error) {
      console.error("❌ PASSWORD VERIFY ERROR:", error);

      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (!passwordValid) {
      console.log("❌ INVALID PASSWORD");

      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    console.log("🔥 PASSWORD VERIFIED");

    const expiresAt = await createSession(user.id);

    console.log("🔥 SESSION CREATED");

    return NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        expiresAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      dream,
      imageUrl,
      summary,
      story,
      sponsorshipStatus,
    } = body;

    if (!firstName || !lastName || !dateOfBirth || !dream || !summary || !story) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const child = await prisma.child.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        dream,
        imageUrl: imageUrl || null,
        summary,
        story,
        sponsorshipStatus: sponsorshipStatus === "Sponsored" ? "Sponsored" : "NotSponsored",
      },
    });

    return NextResponse.json({ success: true, child }, { status: 201 });
  } catch (error) {
    console.error("Error creating child:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create child." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const children = await prisma.child.findMany();
    return NextResponse.json(children, { status: 200 });
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch children." },
      { status: 500 }
    );
  }
}
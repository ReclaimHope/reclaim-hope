import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
   try{
     const body = await req.json();
    const { firstName, lastName, dateOfBirth, dream, imageUrl, summary, story, sponsorshipStatus } = body;
    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            dream,
            imageUrl,
            summary,
            story,
            sponsorshipStatus
        }
    });
   } catch (error) {
    console.error("Error creating child:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to create child" }), { status: 500 });
   }
}
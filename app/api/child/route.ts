import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            firstName,
            lastName,
            dob,
            dream,
            imageUrl,
            status,
            story,
        } = body;

        // Basic validation
        if (
            !firstName ||
            !lastName ||
            !dob ||
            !dream ||
            !imageUrl ||
            !status ||
            !story
        ) {
            return NextResponse.json(
                { error: "Please fill in all fields." },
                { status: 400 }
            );
        }

        const child = await prisma.child.create({
            data: {
                firstName,
                lastName,
                dob: new Date(dob),
                dream,
                imageUrl,
                status,
                story,
            },
        });

        return NextResponse.json(child, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
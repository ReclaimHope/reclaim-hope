import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2ObjectUrl, r2, R2_BUCKET_NAME } from "@/lib/r2";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin login required." },
        { status: 401 }
      );
    }

    const isMultipart = req.headers.get("content-type")?.includes("multipart/form-data");
    const body = isMultipart ? Object.fromEntries(await req.formData()) : await req.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      dream,
      imageUrl,
      story,
    } = body;

    const image = body.image instanceof File ? body.image : null;

    if (image && (!ACCEPTED_IMAGE_TYPES.includes(image.type) || image.size > MAX_IMAGE_SIZE)) {
      return NextResponse.json(
        { success: false, error: "Image must be JPG, PNG, WebP, or AVIF and no larger than 10 MB." },
        { status: 400 }
      );
    }

    if (!firstName || !lastName || !dateOfBirth || !dream || !story) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    let uploadedImageUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";

    if (image) {
      const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `children/${Date.now()}-${safeName}`;
      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: Buffer.from(await image.arrayBuffer()),
          ContentType: image.type,
        })
      );
      uploadedImageUrl = process.env.R2_PUBLIC_URL
        ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
        : key;
    }

    const child = await prisma.child.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        dream,
        imageUrl: uploadedImageUrl || null,
        story,
      },
    });

    revalidatePath("/");
    revalidatePath("/sponsor");
    revalidatePath("/admin/children");

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
    // NOTE: no expiry write here on purpose. This is the hottest read
    // endpoint on the site and a per-request updateMany doubled checkout
    // time under latency, collapsing into P2024 pool timeouts under
    // concurrent load. Expired rows are simply filtered out below; the
    // status flip to COMPLETED happens on write paths (payment success,
    // activation) via expireStaleSponsorships().
    const children = await prisma.child.findMany({
      include: {
        sponsorships: {
          where: {
            status: "ACTIVE",
            OR: [{ endedAt: null }, { endedAt: { gt: new Date() } }],
          },
          include: { donor: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = children.map((c) => {
      const activeSponsorship = c.sponsorships && c.sponsorships.length > 0 ? c.sponsorships[0] : null;
      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        name: `${c.firstName} ${c.lastName}`.trim(),
        dateOfBirth: c.dateOfBirth,
        dream: c.dream,
        imageUrl: c.imageUrl ? getR2ObjectUrl(c.imageUrl) : null,
        story: c.story,
        isSponsored: !!activeSponsorship,
        sponsorshipStatus: activeSponsorship ? "Sponsored" : "NotSponsored",
        sponsorName: activeSponsorship
          ? `${activeSponsorship.donor.firstName} ${activeSponsorship.donor.lastName}`.trim()
          : null,
        activeSponsorship,
      };
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch children." },
      { status: 500 }
    );
  }
}
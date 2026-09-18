import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("banner");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || "event-banner.png";
    const extension = path.extname(originalName).toLowerCase() || ".png";

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: "Only image files (.jpg, .png, .webp) are allowed." },
        { status: 400 }
      );
    }

    const safeName = `teaser-banner-${Date.now()}${extension}`;
    let publicUrl = `/event/${safeName}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "event");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const targetPath = path.join(uploadDir, safeName);
      fs.writeFileSync(targetPath, buffer);
    } catch {
      // In serverless environments (Vercel) where root filesystem is read-only,
      // fallback to high-quality data URL so banners render seamlessly
      const mime = file.type || `image/${extension.replace(".", "")}`;
      publicUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeName,
    });
  } catch (error) {
    console.error("[api/admin/upload-banner] Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload teaser banner image." },
      { status: 500 }
    );
  }
}

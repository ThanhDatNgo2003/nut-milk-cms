import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveFile, checkRateLimit, StorageError } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    /* ---- auth check ---- */
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---- rate limit ---- */
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 10 uploads per minute." },
        { status: 429 }
      );
    }

    /* ---- parse form data ---- */
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    /* ---- save via storage service ---- */
    const result = await saveFile(file);

    console.log(
      `[upload] user=${session.user.email} file=${result.filename} size=${result.size}`
    );

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        filename: result.filename,
        size: result.size,
        type: file.type,
      },
    });
  } catch (error) {
    if (error instanceof StorageError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

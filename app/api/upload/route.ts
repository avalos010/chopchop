import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadUrl = await upload(file.name, fileBuffer);

    return NextResponse.json({ url: uploadUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error_msg: "Upload failed", error },
      { status: 500 }
    );
  }
}

async function upload(fileName: string, fileBuffer: Buffer) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const BUCKET = "uploads";

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "video/mp4",
      },
      body: fileBuffer,
    }
  );

  if (!res.ok) throw new Error("Failed to upload to Supabase");

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

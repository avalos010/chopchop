import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(file, formData);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    console.log(fileBuffer);

    const uploadUrl = await upload(file.name, fileBuffer);

    console.log(uploadUrl);

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
  const BUCKET = "uploads";

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, fileBuffer, {
      contentType: "video/*",
      upsert: true,
    });

  if (error) console.error(error, "error uploading file");

  console.log(data);

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

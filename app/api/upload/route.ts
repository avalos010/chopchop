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
  const BUCKET = "uploads";

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(`public/${fileName}`, fileBuffer, {
      contentType: "video/*",
      upsert: true, //will delete anon vids after 5 mins so this shouldnt matter much here.
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  if (data) {
    // Get the public URL using Supabase's method
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(`public/${fileName}`);

    return publicUrlData.publicUrl;
  }
}

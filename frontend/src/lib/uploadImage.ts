import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* ---------------- INIT CHECKS ---------------- */

if (!SUPABASE_URL) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!SUPABASE_ANON_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!
);

/* ---------------- UPLOAD FUNCTION ---------------- */

export async function uploadImage(file: File): Promise<string> {
  try {

    /* 1. Validate file */
    if (!file) {
      throw new Error("No file provided");
    }

    /* 2. Generate unique filename */
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("vehicles")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(" Supabase upload error:", error);
      throw error;
    }

    /* 4. Get public URL */
    const { data: publicUrlData } = supabase.storage
      .from("vehicles")
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    return publicUrlData.publicUrl;
  } catch (err) {
    throw err;
  }
}
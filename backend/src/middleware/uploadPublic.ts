import multer from "multer";
import { supabase } from "../lib/supabase";

export const publicUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/* ---------------- UPLOAD TO A PUBLIC BUCKET ----------------
   Use for anything customers/visitors are meant to see directly —
   gallery photos, vehicle photos, airport photos, etc. Returns a
   permanent public URL, unlike uploadPaymentScreenshot which never
   does that. */
export async function uploadPublicImage(
  file: Express.Multer.File,
  bucket: string
): Promise<string> {
  const ext = file.originalname.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/* ---------------- DELETE FROM A PUBLIC BUCKET ----------------
   Takes the PUBLIC URL (exactly what's stored on e.g. GalleryImage.image)
   and removes the underlying file from Supabase storage, so replacing or
   deleting a record doesn't leave an orphaned file behind forever.

   Safe to call with a URL that isn't actually a Supabase public URL for
   this bucket (e.g. a legacy local "/uploads/..." path from before a
   migration to Supabase) — it just skips deletion silently in that case
   rather than erroring, since there's nothing in Supabase storage to
   remove for a file that was never uploaded there.

   Never throws — a failed cleanup of an old file should never block or
   fail the actual create/update/delete action the caller is performing.
*/
export async function deletePublicImage(url: string | null | undefined, bucket: string): Promise<void> {
  if (!url) return;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    // Not a Supabase public URL for this bucket — nothing to delete here.
    return;
  }

  const path = url.slice(markerIndex + marker.length);
  if (!path) return;

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.error(`Failed to delete ${bucket}/${path} from storage:`, error);
    }
  } catch (error) {
    console.error(`Failed to delete ${bucket}/${path} from storage:`, error);
  }
}
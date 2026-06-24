import multer from "multer";
import { supabase } from "../lib/supabase";

// Memory storage only — we never touch disk, go straight to Supabase
export const paymentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/* ---------------- UPLOAD TO PRIVATE BUCKET ---------------- */
// Stores payment screenshots in the private `payment-screenshots` bucket.
// Files are NOT publicly accessible — only signed URLs issued by this
// backend can read them, and those expire after 1 hour.
export async function uploadPaymentScreenshot(
  file: Express.Multer.File
): Promise<string> {
  const ext = file.originalname.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("payment-screenshots")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  // Return the storage path only — NOT a public URL.
  // Actual readable URLs are generated on demand via getSignedUrl().
  return data.path;
}

/* ---------------- GENERATE SIGNED URL (ADMIN VIEW) ---------------- */
// Call this when the admin needs to actually view a screenshot.
// URL expires after 1 hour — cannot be bookmarked or shared permanently.
export async function getPaymentScreenshotUrl(
  storagePath: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from("payment-screenshots")
    .createSignedUrl(storagePath, 60 * 60); // 1 hour

  if (error || !data?.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }

  return data.signedUrl;
}
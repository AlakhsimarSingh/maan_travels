import { Router } from "express";
import multer from "multer";
import { supabase } from "../lib/supabase";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB — generous for vehicle/gallery photos, not for arbitrary files
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error("Only image uploads (jpeg, png, webp, gif) are allowed"));
      return;
    }
    cb(null, true);
  },
});

/* ---------------- UPLOAD IMAGE (ADMIN) ----------------
   Nothing customer-facing uses this — it's how vehicle/gallery images get
   into Supabase storage from the admin panel. No public use case, so it
   stays behind requireAdminDevice (matches the same reasoning as
   stats.routes.ts: this isn't data the public site needs to write to). */
router.post("/", requireAdminDevice, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("vehicles")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("vehicles")
      .getPublicUrl(fileName);

    res.json({
      success: true,
      url: publicUrl.publicUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Upload failed",
    });
  }
});

export default router;
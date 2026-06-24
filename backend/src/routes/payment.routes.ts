import { Router } from "express";
import multer from "multer";
import prisma from "../prisma";
import { supabase } from "../lib/supabase";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();

const SETTINGS_ID = "default";

// Memory-only multer — QR code goes straight to Supabase, never touches disk
const qrUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB is plenty for a QR image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// QR code goes to the public vehicles bucket — customers need to see it
// directly in their browser when making a payment, so it must be publicly
// accessible via a permanent URL (unlike payment screenshots which are private).
async function uploadQrCode(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split(".").pop() || "png";
  const fileName = `qr/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("vehicles")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true, // overwrite — there's only ever one active QR code
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("vehicles")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

/* ---------------- GET PAYMENT SETTINGS (PUBLIC) ----------------
   Customers need this to render the QR code / UPI ID before uploading
   a payment screenshot. Nothing sensitive here — a QR code and UPI ID
   are meant to be shown to anyone who is about to pay. */
router.get("/settings", async (req, res) => {
  try {
    const settings = await prisma.paymentSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    res.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch payment settings" });
  }
});

/* ---------------- UPDATE PAYMENT SETTINGS (ADMIN) ---------------- */
router.post("/settings", requireAdminDevice, qrUpload.single("qrCode"), async (req, res) => {
  try {
    const { upiId } = req.body;

    if (!req.file && !upiId) {
      return res.status(400).json({
        success: false,
        message: "Provide a QR code image or a UPI ID",
      });
    }

    const data: any = {};
    if (req.file) data.qrCodeImage = await uploadQrCode(req.file);
    if (upiId) data.upiId = upiId;

    const settings = await prisma.paymentSettings.upsert({
      where: { id: SETTINGS_ID },
      update: data,
      create: {
        id: SETTINGS_ID,
        qrCodeImage: data.qrCodeImage || "",
        upiId: data.upiId,
      },
    });

    res.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update payment settings" });
  }
});

export default router;
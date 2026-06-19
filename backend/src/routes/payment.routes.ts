import { Router } from "express";
import prisma from "../prisma";
import { upload } from "../middleware/upload";

const router = Router();

const SETTINGS_ID = "default";

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

router.post("/settings", upload.single("qrCode"), async (req, res) => {
  try {
    const { upiId } = req.body;

    if (!req.file && !upiId) {
      return res.status(400).json({
        success: false,
        message: "Provide a QR code image or a UPI ID",
      });
    }

    const data: any = {};
    if (req.file) data.qrCodeImage = `/uploads/${req.file.filename}`;
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
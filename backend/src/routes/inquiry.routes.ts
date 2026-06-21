import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* ---------------- CREATE (PUBLIC) ---------------- */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and message are required",
      });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        subject: subject || "General Inquiry",
        message,
      },
    });

    res.json({ success: true, inquiry });
  } catch (error) {
    console.error("INQUIRY CREATE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to submit inquiry" });
  }
});

/* ---------------- GET ALL (ADMIN) ---------------- */
router.get("/", async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, inquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch inquiries" });
  }
});

/* ---------------- UPDATE STATUS (ADMIN) ---------------- */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["new", "contacted", "closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update inquiry status" });
  }
});

/* ---------------- DELETE (ADMIN) ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Inquiry deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete inquiry" });
  }
});

export default router;
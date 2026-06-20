import { Router } from "express";
import prisma from "../prisma";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch gallery" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch gallery" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { description, category } = req.body;

    if (!req.file || !category) {
      return res.status(400).json({ success: false, message: "image and category are required" });
    }

    const image = await prisma.galleryImage.create({
      data: {
        image: `/uploads/${req.file.filename}`,
        description,
        category,
      },
    });

    res.json({ success: true, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id as string;
    const { description, category, active, order } = req.body;

    const data: any = {};
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (active !== undefined) data.active = active === "true" || active === true;
    if (order !== undefined) data.order = Number(order);
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const image = await prisma.galleryImage.update({ where: { id }, data });

    res.json({ success: true, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update image" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.galleryImage.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete image" });
  }
});

export default router;
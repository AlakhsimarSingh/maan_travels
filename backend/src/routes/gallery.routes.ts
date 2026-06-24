import { Router } from "express";
import prisma from "../prisma";
import { publicUpload, uploadPublicImage, deletePublicImage } from "../middleware/uploadPublic";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

/* ---------------- PUBLIC — active gallery images only ---------------- */
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

/* ---------------- ADMIN — everything, including inactive ---------------- */
router.get("/all", requireAdminDevice, async (req, res) => {
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

/* ---------------- ADMIN — upload a new gallery image ----------------
   Uploads to the public `gallery` Supabase bucket and stores the
   resulting public URL directly on GalleryImage.image. */
router.post("/", requireAdminDevice, publicUpload.single("image"), async (req, res) => {
  try {
    const { description, category } = req.body;

    if (!req.file || !category) {
      return res.status(400).json({ success: false, message: "image and category are required" });
    }

    const imageUrl = await uploadPublicImage(req.file, "gallery");

    const image = await prisma.galleryImage.create({
      data: {
        image: imageUrl,
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

/* ---------------- ADMIN — update/reorder/toggle a gallery image ----------------
   If a new image file is included, the old one is deleted from Supabase
   storage AFTER the new one uploads successfully and the database row is
   updated — in that order, so a failed upload or failed DB write never
   leaves the record pointing at a deleted file. */
router.put("/:id", requireAdminDevice, publicUpload.single("image"), async (req, res) => {
  try {
    const id = getParam(req.params.id);
    const { description, category, active, order } = req.body;

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    const data: any = {};
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (active !== undefined) data.active = active === "true" || active === true;
    if (order !== undefined) data.order = Number(order);

    let newImageUrl: string | null = null;
    if (req.file) {
      newImageUrl = await uploadPublicImage(req.file, "gallery");
      data.image = newImageUrl;
    }

    const image = await prisma.galleryImage.update({ where: { id }, data });

    // Only clean up the OLD file once the new one is safely uploaded and
    // the database row has been updated to point at it.
    if (newImageUrl) {
      await deletePublicImage(existing.image, "gallery");
    }

    res.json({ success: true, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update image" });
  }
});

/* ---------------- ADMIN — delete a gallery image ---------------- */
router.delete("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    await prisma.galleryImage.delete({ where: { id } });

    // Clean up the file in storage only after the database row is
    // confirmed deleted.
    await deletePublicImage(existing.image, "gallery");

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete image" });
  }
});

export default router;
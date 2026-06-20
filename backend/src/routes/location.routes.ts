import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/*
PUBLIC
GET PICKUP LOCATIONS
*/
router.get("/pickup", async (req, res) => {
  try {
    const locations = await prisma.tourLocation.findMany({
      where: {
        active: true,
        canPickup: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({ success: true, locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pickup locations",
    });
  }
});


router.get("/drop", async (req, res) => {
  try {
    const locations = await prisma.tourLocation.findMany({
      where: {
        active: true,
        canDrop: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({ success: true, locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch drop locations",
    });
  }
});

/*
PUBLIC
GET ALL ACTIVE LOCATIONS (with images) — used by the tour hero slideshow
*/
router.get("/active", async (req, res) => {
  try {
    const locations = await prisma.tourLocation.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });

    res.json({ success: true, locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
    });
  }
});

/*
ADMIN
GET ALL
*/
router.get("/all", async (req, res) => {
  try {
    const locations = await prisma.tourLocation.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
    });
  }
});

/*
ADMIN
CREATE
*/
router.post("/", async (req, res) => {
  try {
    const { name, imageUrl, canPickup, canDrop } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Location name is required",
      });
    }

    const location = await prisma.tourLocation.create({
      data: {
        name: name.trim(),
        imageUrl: imageUrl || null,
        canPickup: canPickup ?? false,
        canDrop: canDrop ?? false,
      },
    });

    res.json({ success: true, location });
  } catch (error: any) {
    console.error(error);

    // Unique constraint on `name` — surface a clear message instead of a generic 500
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "A location with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create location",
    });
  }
});

/*
ADMIN
UPDATE
*/
router.put("/:id", async (req, res) => {
  try {
    const { name, imageUrl, canPickup, canDrop, active } = req.body;

    const location = await prisma.tourLocation.update({
      where: { id: req.params.id },
      data: {
        name,
        imageUrl: imageUrl ?? undefined,
        canPickup,
        canDrop,
        active,
      },
    });

    res.json({ success: true, location });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update location",
    });
  }
});

/*
ADMIN
DELETE
*/
router.delete("/:id", async (req, res) => {
  try {
    await prisma.tourLocation.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: "Location deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete location",
    });
  }
});

export default router;
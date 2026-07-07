import { Router } from "express";
import prisma from "../prisma";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();
const VALID_DIRECTIONS = ["TO_AIRPORT", "FROM_AIRPORT"];

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

// PUBLIC — active cities, optionally filtered by direction
// ?direction=TO_AIRPORT   -> cities where canPickup = true (city -> airport)
// ?direction=FROM_AIRPORT -> cities where canDrop = true   (airport -> city)
router.get("/", async (req, res) => {
  try {
    const direction = getParam(req.query.direction as any);

    const where: any = { active: true };
    if (direction === "TO_AIRPORT") where.canPickup = true;
    if (direction === "FROM_AIRPORT") where.canDrop = true;

    const cities = await prisma.airportCity.findMany({ where, orderBy: { name: "asc" } });
    res.json({ success: true, cities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch cities" });
  }
});

// ADMIN — everything, including inactive
router.get("/all", requireAdminDevice, async (req, res) => {
  try {
    const cities = await prisma.airportCity.findMany({ orderBy: { name: "asc" } });
    res.json({ success: true, cities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch cities" });
  }
});

// ADMIN — create city
router.post("/", requireAdminDevice, async (req, res) => {
  try {
    const { name, canPickup, canDrop, active } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "name is required" });

    const city = await prisma.airportCity.create({
      data: {
        name,
        canPickup: canPickup !== undefined ? Boolean(canPickup) : true,
        canDrop: canDrop !== undefined ? Boolean(canDrop) : true,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    res.json({ success: true, city });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({ success: false, message: "A city with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to create city" });
  }
});

// ADMIN — update city
router.put("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);
    const { name, canPickup, canDrop, active } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (canPickup !== undefined) data.canPickup = Boolean(canPickup);
    if (canDrop !== undefined) data.canDrop = Boolean(canDrop);
    if (active !== undefined) data.active = Boolean(active);

    const city = await prisma.airportCity.update({ where: { id }, data });
    res.json({ success: true, city });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update city" });
  }
});

// ADMIN — delete city
router.delete("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);
    await prisma.airportCity.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete city" });
  }
});

// PUBLIC — all price cells for one airport, across all cities/vehicles/directions.
// Booking form fetches once per airport, then filters client-side by
// city + direction as the user picks — same pattern as /api/airports
// exposing pricing publicly.
router.get("/pricing/:airportId", async (req, res) => {
  try {
    const airportId = getParam(req.params.airportId);
    const pricing = await prisma.airportCityPricing.findMany({ where: { airportId } });
    res.json({ success: true, pricing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch pricing" });
  }
});

// ADMIN — same data, used by the pricing matrix (kept as a distinct
// admin-labeled path so it can be gated/expanded differently later)
router.get("/pricing/:airportId/all", requireAdminDevice, async (req, res) => {
  try {
    const airportId = getParam(req.params.airportId);
    const pricing = await prisma.airportCityPricing.findMany({ where: { airportId } });
    res.json({ success: true, pricing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch pricing" });
  }
});

// ADMIN — upsert one price cell (airport + city + vehicle + direction)
router.post("/pricing", requireAdminDevice, async (req, res) => {
  try {
    const { airportId, cityId, vehicleId, direction, price } = req.body;

    if (!airportId || !cityId || !vehicleId || !direction || price === undefined) {
      return res.status(400).json({ success: false, message: "airportId, cityId, vehicleId, direction, and price are required" });
    }
    if (!VALID_DIRECTIONS.includes(direction)) {
      return res.status(400).json({ success: false, message: "Invalid direction" });
    }

    const updated = await prisma.airportCityPricing.upsert({
      where: { airportId_cityId_vehicleId_direction: { airportId, cityId, vehicleId, direction } },
      update: { price },
      create: { airportId, cityId, vehicleId, direction, price },
    });

    res.json({ success: true, updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update pricing" });
  }
});

export default router;
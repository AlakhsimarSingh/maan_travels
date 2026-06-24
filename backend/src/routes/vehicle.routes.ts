import { Router } from "express";
import prisma from "../prisma";
import { requireAdminDevice } from "../middleware/requireAdminDevice";

const router = Router();

// See booking.routes.ts / routes.routes.ts for why this normalization is
// needed — some @types/express configurations type route params as
// string | string[] | undefined rather than plain string.
function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

/* ---------------- GET ALL VEHICLES (ADMIN) ---------------- */
router.get("/all", requireAdminDevice, async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
});

/* ---------------- SHARED PAYLOAD BUILDER ---------------- */
function buildVehicleData(body: any) {
  const {
    name,
    category,
    price,
    imageUrl,
    available,

    isTaxiFleet,
    isSelfDrive,

    fuelType,
    transmission,
    seats,
    modelYear,
    rentalPerDay,

    passengerCapacity,
    suitcaseCapacity,

    description,
  } = body;

  // A vehicle can belong to taxi fleet, self drive, both, or neither.
  // Each flag is independent — no exclusivity rule.
  const isTaxi = isTaxiFleet === true;
  const isSelf = isSelfDrive === true;

  return {
    name,
    category,
    price: price ? Number(price) : 0,
    imageUrl: imageUrl || null,
    available: available ?? true,

    isTaxiFleet: isTaxi,
    isSelfDrive: isSelf,

    // Self-drive specs only matter (and are only shown) when isSelfDrive is true,
    // but we don't null them out just because isTaxiFleet is also true —
    // a vehicle can be both, and should keep its self-drive specs either way.
    fuelType: isSelf ? fuelType || null : null,
    transmission: isSelf ? transmission || null : null,
    seats: isSelf && seats ? Number(seats) : null,
    modelYear: isSelf && modelYear ? Number(modelYear) : null,
    rentalPerDay: isSelf && rentalPerDay ? Number(rentalPerDay) : null,

    passengerCapacity: passengerCapacity ? Number(passengerCapacity) : null,
    suitcaseCapacity: suitcaseCapacity ? Number(suitcaseCapacity) : null,

    description: description || null,
  };
}

/* ---------------- CREATE VEHICLE (ADMIN) ---------------- */
router.post("/", requireAdminDevice, async (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Note: isTaxiFleet/isSelfDrive are independent and BOTH may be false —
    // this is expected for Luxury and Tempo/Urbania vehicles, which are
    // managed through their own dedicated admin pages and are neither
    // part of the taxi fleet nor self-drive.
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    if (price === undefined || price === null || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: buildVehicleData(req.body),
    });

    res.json({ success: true, vehicle });
  } catch (error) {
    console.error("CREATE VEHICLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
    });
  }
});

/* ---------------- UPDATE VEHICLE (ADMIN) ---------------- */
router.put("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);
    const { name, category, price } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    if (price === undefined || price === null || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: buildVehicleData(req.body),
    });

    res.json({ success: true, vehicle });
  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
});

/* ---------------- TOGGLE (ADMIN) ---------------- */
router.patch("/:id/toggle", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        available: !vehicle.available,
      },
    });

    res.json({ success: true, vehicle: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle vehicle",
    });
  }
});

/* ---------------- DELETE (ADMIN) ---------------- */
router.delete("/:id", requireAdminDevice, async (req, res) => {
  try {
    const id = getParam(req.params.id);

    await prisma.vehicle.delete({
      where: { id },
    });

    res.json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
});

/* ---------------- ACTIVE (PUBLIC) ----------------
   The website needs this to show available vehicles on every public
   fleet page (taxi, self-drive, tempo/urbania, etc.) — stays unprotected. */
router.get("/", async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
});

export default router;
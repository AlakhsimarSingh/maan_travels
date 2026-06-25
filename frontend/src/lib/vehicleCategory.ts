/**
 * Membership checks for "does this vehicle belong to filter X" — NOT a
 * single classification per vehicle. A vehicle can legitimately match
 * more than one bucket (e.g. isSelfDrive=true AND isTaxiFleet=true is a
 * valid combination in the data), and such vehicles should appear under
 * every filter they match, not just one.
 *
 * Luxury is still checked independently via `category` containing
 * "luxury" — a luxury vehicle could in principle also have isTaxiFleet
 * or isSelfDrive true in the data, but FleetCard's own navigation logic
 * (handleNavigation) always routes luxury-category vehicles to
 * /luxury-cars regardless of those flags, so we keep luxury exclusive
 * here to match that existing click-through behavior. Self Drive and
 * Taxi Fleet, by contrast, are independent flags with no such override
 * elsewhere in the code, so both are honored when both are true.
 */

export type FleetFilterType = "all" | "luxury" | "self-drive" | "taxi";

export type CategorizableVehicle = {
  category?: string | null;
  isSelfDrive?: boolean | null;
  isTaxiFleet?: boolean | null;
};

function isLuxury(vehicle: CategorizableVehicle): boolean {
  return (vehicle.category || "").toLowerCase().includes("luxury");
}

export function matchesFilter(
  vehicle: CategorizableVehicle,
  filter: FleetFilterType
): boolean {
  if (filter === "all") return true;
  if (filter === "luxury") return isLuxury(vehicle);

  // A luxury-category vehicle is excluded from self-drive/taxi even if
  // those flags happen to be true, so it doesn't show up duplicated
  // under Luxury AND Taxi Fleet when it's really meant to live under
  // Luxury alone (matches FleetCard's navigation precedence).
  if (isLuxury(vehicle)) return false;

  if (filter === "self-drive") return Boolean(vehicle.isSelfDrive);
  if (filter === "taxi") return Boolean(vehicle.isTaxiFleet);

  return false;
}

export function filterVehicles<T extends CategorizableVehicle>(
  vehicles: T[],
  filter: FleetFilterType
): T[] {
  if (filter === "all") return vehicles;
  return vehicles.filter((v) => matchesFilter(v, filter));
}

export function countByFilterType(vehicles: CategorizableVehicle[]) {
  return {
    all: vehicles.length,
    luxury: vehicles.filter((v) => matchesFilter(v, "luxury")).length,
    "self-drive": vehicles.filter((v) => matchesFilter(v, "self-drive")).length,
    taxi: vehicles.filter((v) => matchesFilter(v, "taxi")).length,
  };
}

export const FLEET_FILTER_PARAM = "type";

export function parseFleetFilterParam(value?: string | string[] | null): FleetFilterType {
  const v = Array.isArray(value) ? value[0] : value;
  if (v === "luxury" || v === "self-drive" || v === "taxi") return v;
  return "all";
}
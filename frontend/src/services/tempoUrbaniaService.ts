import { getAllVehicles, getActiveVehicles } from "@/src/services/vehicleService";

const TEMPO_CATEGORIES = ["Tempo Traveller", "Urbania"];

function isValidTempoVehicle(v: any): boolean {
  const isTempoCategory = TEMPO_CATEGORIES.includes(v.category);

  // Tempo / Urbania vehicles belong to neither the taxi fleet nor
  // self-drive — same rule as Luxury cars. Both flags must be false.
  const isValidFleet = v.isSelfDrive !== true && v.isTaxiFleet !== true;

  const hasCapacity =
    typeof v.passengerCapacity === "number" && v.passengerCapacity > 0;

  return isTempoCategory && isValidFleet && hasCapacity;
}

/**
 * PUBLIC — for the customer-facing tempo page. Calls the public,
 * unauthenticated /api/vehicles endpoint (active vehicles only).
 *
 * Use this from client components or pass through a server fetch —
 * never call getAllVehicles() from public-facing code, since that hits
 * the admin-only /api/vehicles/all endpoint and will 401 for regular
 * visitors who aren't a registered admin device.
 */
export async function getTempoUrbaniaVehiclesPublic() {
  const res = await getActiveVehicles();

  if (!res?.success || !Array.isArray(res.vehicles)) {
    return [];
  }

  return res.vehicles.filter(isValidTempoVehicle);
}

/**
 * ADMIN — for the admin tempo management page only. Calls the
 * admin-protected /api/vehicles/all endpoint (includes inactive
 * vehicles, since an admin needs to see and edit those too). Only
 * call this from code that already runs behind AdminGuard.
 */
export async function getTempoUrbaniaVehiclesAdmin() {
  const res = await getAllVehicles();

  if (!res?.success || !Array.isArray(res.vehicles)) {
    return [];
  }

  return res.vehicles.filter(isValidTempoVehicle);
}
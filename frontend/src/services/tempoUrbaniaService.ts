import { getAllVehicles } from "@/src/services/vehicleService";

export async function getTempoUrbaniaVehicles() {
  const res = await getAllVehicles();

  if (!res?.success || !Array.isArray(res.vehicles)) {
    return [];
  }

  return res.vehicles.filter((v: any) => {
    const isTempoCategory =
      v.category === "Tempo Traveller" ||
      v.category === "Urbania";

    const isValidFleet =
      v.isSelfDrive === false; // tempo can NEVER be self drive

    const hasCapacity =
      typeof v.passengerCapacity === "number" &&
      v.passengerCapacity > 0;

    return isTempoCategory && isValidFleet && hasCapacity;
  });
}
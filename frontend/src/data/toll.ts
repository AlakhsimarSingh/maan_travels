// Toll estimation for North Indian highways (NH1/NH44 corridor relevant to
// Punjab/Himachal/J&K routes). Actual tolls vary by exact route and vehicle
// class, so this models a realistic banded average rather than a fixed
// per-km rate, since short trips often cross zero toll plazas while long
// highway trips cross several.

export function estimateToll(distanceKm: number, vehicleCategory?: string | null): number {
  if (distanceKm < 30) return 0; // short local trips rarely hit a toll plaza

  // Average ₹/plaza for a standard car class; SUVs/larger vehicles pay more
  const isLargeVehicle = (vehicleCategory || "").toLowerCase().match(/suv|mpv|tempo|urbania|luxury/);
  const perPlaza = isLargeVehicle ? 95 : 65;

  // Rough plaza frequency on Indian national highways: ~1 plaza per 60-80km
  const estimatedPlazas = Math.max(1, Math.round(distanceKm / 70));

  return estimatedPlazas * perPlaza;
}
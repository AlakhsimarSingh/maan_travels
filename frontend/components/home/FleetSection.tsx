import FleetSectionClient from "./FleetSectionClient";

type Vehicle = {
  id: string;
  name: string;
  imageUrl?: string | null;
  category?: string | null;
  price?: number | null;
  description?: string | null;
  isSelfDrive?: boolean;
  isTaxiFleet?: boolean;
  passengerCapacity?: number | null;
  rentalPerDay?: number | null;
};

export default function FleetSection({ vehicles }: { vehicles: Vehicle[] }) {
  return <FleetSectionClient vehicles={vehicles} />;
}
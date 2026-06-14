import Image from "next/image";
import { Button } from "@/components/ui/button";

type FleetCardProps = {
  name: string;
  image: string;
  description: string;
  capacity?: string;
};

export default function FleetCard({
  name,
  image,
  description,
  capacity,
}: FleetCardProps) {
  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-[#252525]
        bg-[#141414]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#ecb100]
        hover:shadow-[0_0_30px_rgba(236,177,0,0.15)]
      "
    >
      {/* Vehicle Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/80
            via-black/20
            to-transparent
          "
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold text-white">
          {name}
        </h3>

        <p className="mb-5 text-sm leading-relaxed text-[#8a8a8a]">
          {description}
        </p>

        {capacity ? (
          <div
            className="
              mb-6
              inline-flex
              items-center
              rounded-full
              border
              border-[#252525]
              bg-[#1b1b1b]
              px-3
              py-1.5
              text-xs
              font-medium
              text-[#ecb100]
            "
          >
            {capacity}
          </div>
        ) : null}

        <Button
          className="
            w-full
            border
            border-[#ecb100]
            bg-transparent
            text-[#ecb100]

            hover:bg-[#ecb100]
            hover:text-black
            hover:border-[#ecb100]

            transition-all
            duration-300
          "
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
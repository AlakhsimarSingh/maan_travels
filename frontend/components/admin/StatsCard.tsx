type StatsCardProps = {
  title: string;
  value: string;
};

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#252525]
        bg-[#141414]
        p-6
        transition
        hover:border-[#ecb100]
        hover:shadow-[0_0_20px_rgba(236,177,0,0.12)]
      "
    >
      <p className="text-sm text-[#8a8a8a]">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-white">
        {value}
      </h3>
    </div>
  );
}
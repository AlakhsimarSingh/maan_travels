type StatsCardProps = {
  title: string;
  value: string | number;
  loading?: boolean;
};

export default function StatsCard({ title, value, loading }: StatsCardProps) {
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

      {loading ? (
        <div className="mt-3 h-8 w-16 animate-pulse rounded bg-[#252525]" />
      ) : (
        <h3 className="mt-2 text-3xl font-bold text-white">
          {value}
        </h3>
      )}
    </div>
  );
}
type SectionHeadingProps = {
  badge?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  badge,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-14 text-center">
      {badge && (
        <p className="mb-3 uppercase tracking-[0.3em] text-[#ecb100]">
          {badge}
        </p>
      )}

      <h2 className="text-4xl font-bold text-white md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-3xl text-[#8a8a8a]">
          {description}
        </p>
      )}
    </div>
  );
}
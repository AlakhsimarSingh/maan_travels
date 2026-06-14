type PageHeroProps = {
  title: string;
  description?: string;
};

export default function PageHero({
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="border-b border-[#252525] bg-[#111111] py-28">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mx-auto max-w-3xl text-[#8a8a8a]">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
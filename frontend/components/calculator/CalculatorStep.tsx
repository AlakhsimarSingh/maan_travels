"use client";

export default function CalculatorStep({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mb-6 rounded-2xl border border-[#252525] bg-black/30 p-6 transition-colors duration-300 last:mb-0">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ecb100] text-sm font-bold text-black">
          {step}
        </div>

        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      {children}
    </div>
  );
}
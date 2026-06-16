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
    <div className="mb-8 rounded-2xl border border-[#252525] bg-black/30 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ecb100] text-black font-bold">
          {step}
        </div>

        <h2 className="text-white font-semibold text-lg">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}
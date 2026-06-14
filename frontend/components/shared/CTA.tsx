import { Button } from "@/components/ui/button";

type CTAProps = {
  title: string;
  description: string;
};

export default function CTA({
  title,
  description,
}: CTAProps) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-[#252525] bg-[#141414] p-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            {title}
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-[#8a8a8a]">
            {description}
          </p>

          <Button
            size="lg"
            className="bg-[#ecb100] text-black hover:bg-[#f6c94c]"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
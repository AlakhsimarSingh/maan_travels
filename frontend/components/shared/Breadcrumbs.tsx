import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({
  items,
}: BreadcrumbsProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 text-sm">
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center gap-2"
        >
          {item.href ? (
            <Link
              href={item.href}
              className="text-[#ecb100] hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#8a8a8a]">
              {item.label}
            </span>
          )}

          {index < items.length - 1 && (
            <span className="text-[#555]">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}
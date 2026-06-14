type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-[#252525] bg-[#141414] p-12 text-center">
      <h3 className="mb-3 text-2xl font-semibold text-white">
        {title}
      </h3>

      {description && (
        <p className="text-[#8a8a8a]">
          {description}
        </p>
      )}
    </div>
  );
}
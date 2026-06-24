export default function ReviewsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-44 rounded-3xl border border-[#252525] bg-[#141414] animate-pulse" />
      ))}
    </div>
  );
}
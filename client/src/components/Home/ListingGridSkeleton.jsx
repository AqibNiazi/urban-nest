// ── Skeleton loader for listing grid ─────────────────────────────────────────
const ListingGridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse"
      >
        <div className="aspect-video bg-stone-200" />
        <div className="p-4 space-y-2.5">
          <div className="h-4 bg-stone-200 rounded-lg w-3/4" />
          <div className="h-3 bg-stone-100 rounded-lg w-1/2" />
          <div className="flex gap-2 mt-3">
            <div className="h-3 bg-stone-200 rounded w-16" />
            <div className="h-3 bg-stone-200 rounded w-16" />
          </div>
          <div className="h-5 bg-amber-100 rounded-lg w-1/3 mt-1" />
        </div>
      </div>
    ))}
  </div>
);

export default ListingGridSkeleton;

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clientBaseURL, clientEndPoints } from "@/config";
import { FilterChip, ListingCard } from "@/components";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync URL → state + fetch
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    setSidebardata({
      searchTerm: urlParams.get("searchTerm") || "",
      type: urlParams.get("type") || "all",
      // ✅ FIX: absence of param = false (show all), only true when explicitly "true"
      parking: urlParams.get("parking") === "true",
      furnished: urlParams.get("furnished") === "true",
      offer: urlParams.get("offer") === "true",
      sort: urlParams.get("sort") || "createdAt",
      order: urlParams.get("order") || "desc",
    });

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const response = await clientBaseURL.get(
          `${clientEndPoints.getListings}?${urlParams.toString()}`,
        );
        const data = response?.data?.data || [];
        setListings(data);
        setShowMore(data.length >= 9);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === "searchTerm") {
      setSidebardata((prev) => ({ ...prev, searchTerm: value }));
      return;
    }
    if (["all", "rent", "sale"].includes(id)) {
      setSidebardata((prev) => ({ ...prev, type: id }));
      return;
    }
    if (["parking", "furnished", "offer"].includes(id)) {
      setSidebardata((prev) => ({ ...prev, [id]: checked }));
      return;
    }
    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata((prev) => ({ ...prev, sort, order }));
    }
  };

  // ✅ KEY FIX: Only set boolean params when TRUE — never send "false" to backend
  // When param is absent, backend uses { $in: [true, false] } = show ALL listings
  // When param is "false", backend returns ONLY listings where field IS false — wrong!
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm)
      urlParams.set("searchTerm", sidebardata.searchTerm);

    if (sidebardata.type !== "all") urlParams.set("type", sidebardata.type);

    // ✅ Only include when checked — omitting = "show all" on backend
    if (sidebardata.parking) urlParams.set("parking", "true");
    if (sidebardata.furnished) urlParams.set("furnished", "true");
    if (sidebardata.offer) urlParams.set("offer", "true");

    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    navigate(`/search?${urlParams.toString()}`, { replace: true });
    setSidebarOpen(false);
  };

  const onShowMoreClick = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", listings.length);
      const response = await clientBaseURL.get(
        `${clientEndPoints.getListings}?${urlParams.toString()}`,
      );
      const data = response?.data?.data || [];
      setListings((prev) => [...prev, ...data]);
      setShowMore(data.length >= 9);
    } catch (error) {
      console.error("Error loading more listings:", error);
    }
  };

  const activeFilterCount = [
    sidebardata.type !== "all",
    sidebardata.parking,
    sidebardata.furnished,
    sidebardata.offer,
  ].filter(Boolean).length;

  const FilterSidebar = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
          Search
        </label>
        <input
          type="text"
          id="searchTerm"
          placeholder="Keywords…"
          value={sidebardata.searchTerm}
          onChange={handleChange}
          className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm rounded-xl px-4 py-2.5
                     placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50
                     focus:border-amber-400 hover:border-stone-300 transition-all duration-200"
        />
      </div>

      <div>
        <label className="block mb-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
          Type
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All", icon: "🏘️" },
            { id: "sale", label: "For Sale", icon: "🏠" },
            { id: "rent", label: "For Rent", icon: "🔑" },
          ].map((t) => (
            <FilterChip
              key={t.id}
              id={t.id}
              label={t.label}
              icon={t.icon}
              checked={sidebardata.type === t.id}
              onChange={() =>
                setSidebardata((prev) => ({ ...prev, type: t.id }))
              }
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            id="parking"
            label="Parking"
            icon="🚗"
            checked={sidebardata.parking}
            onChange={handleChange}
          />
          <FilterChip
            id="furnished"
            label="Furnished"
            icon="🛋️"
            checked={sidebardata.furnished}
            onChange={handleChange}
          />
          <FilterChip
            id="offer"
            label="Has Offer"
            icon="🏷️"
            checked={sidebardata.offer}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block mb-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
          Sort by
        </label>
        <select
          id="sort_order"
          onChange={handleChange}
          value={`${sidebardata.sort}_${sidebardata.order}`}
          className="w-full bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-xl px-4 py-2.5
                     focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                     hover:border-stone-300 transition-all duration-200 cursor-pointer"
        >
          <option value="createdAt_desc">Newest first</option>
          <option value="createdAt_asc">Oldest first</option>
          <option value="regularPrice_desc">Price: High → Low</option>
          <option value="regularPrice_asc">Price: Low → High</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white
                   bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600
                   rounded-xl shadow-md shadow-amber-200 hover:shadow-amber-300
                   transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Apply Filters
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50/40">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-stone-800 text-sm">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-stone-800">
                  {sidebardata.searchTerm
                    ? `Results for "${sidebardata.searchTerm}"`
                    : "All Properties"}
                </h1>
                <p className="text-sm text-stone-400 mt-0.5">
                  {loading
                    ? "Searching…"
                    : `${listings.length} listing${listings.length !== 1 ? "s" : ""} found`}
                </p>
              </div>

              {/* Mobile filter button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-semibold
                           bg-white border border-stone-200 rounded-xl shadow-sm hover:border-stone-300 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-video bg-stone-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-stone-200 rounded-lg w-3/4" />
                      <div className="h-3 bg-stone-100 rounded-lg w-1/2" />
                      <div className="h-5 bg-stone-200 rounded-lg w-1/3 mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && listings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-stone-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-700 mb-1">
                  No listings found
                </h3>
                <p className="text-sm text-stone-400 max-w-xs">
                  Try adjusting your filters or search term to find more
                  properties
                </p>
              </div>
            )}

            {/* Results grid */}
            {!loading && listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {/* Show more */}
            {showMore && !loading && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={onShowMoreClick}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold
                             text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100
                             rounded-xl transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  Show more listings
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-stone-800">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-stone-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
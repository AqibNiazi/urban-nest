// ── Listing card ─────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";
const ListingCard = ({ listing }) => (
  <Link to={`/listing/${listing._id}`} className="group block">
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:shadow-stone-200/60 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={listing.imageUrls?.[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg capitalize shadow-sm
          ${
            listing.type === "rent"
              ? "bg-blue-500 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          {listing.type === "rent" ? "🔑 Rent" : "🏠 Sale"}
        </span>
        {listing.offer && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-green-500 text-white shadow-sm">
            🏷️ Offer
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-sm font-bold text-stone-800 truncate group-hover:text-amber-600 transition-colors">
          {listing.title}
        </p>
        <p className="text-xs text-stone-400 mt-1 truncate flex items-center gap-1">
          <svg
            className="w-3 h-3 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {listing.address}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-100">
          <span className="flex items-center gap-1 text-xs text-stone-500">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {listing.bedrooms} bed{listing.bedrooms > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 text-xs text-stone-500">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12h16M4 6h16M4 18h7" />
            </svg>
            {listing.bathrooms} bath{listing.bathrooms > 1 ? "s" : ""}
          </span>
          {listing.furnished && (
            <span className="text-xs text-stone-400 flex items-center gap-1">
              🛋️ Furnished
            </span>
          )}
          {listing.parking && (
            <span className="text-xs text-stone-400 flex items-center gap-1">
              🚗 Parking
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            {listing.offer && listing.discountPrice > 0 ? (
              <>
                <span className="text-lg font-black text-stone-800">
                  ${Number(listing.discountPrice).toLocaleString()}
                </span>
                <span className="text-xs text-stone-400 line-through ml-2">
                  ${Number(listing.regularPrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-black text-stone-800">
                ${Number(listing.regularPrice).toLocaleString()}
              </span>
            )}
            {listing.type === "rent" && (
              <span className="text-xs text-stone-400 ml-1">/mo</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default ListingCard;

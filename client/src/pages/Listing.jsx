import React, { useEffect, useState } from "react";
import { clientBaseURL, clientEndPoints } from "@/config";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Contact } from "@/components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";

// ── Skeleton loader that matches the listing layout ──────────────────────────
const ListingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50/30 animate-pulse">
    {/* Image skeleton */}
    <div className="w-full h-[60vh] max-h-[520px] bg-stone-200" />

    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Title + price */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="h-7 bg-stone-200 rounded-xl w-20" />
          <div className="h-7 bg-amber-100 rounded-xl w-24" />
        </div>
        <div className="h-8 bg-stone-200 rounded-xl w-3/4" />
        <div className="h-5 bg-stone-100 rounded-xl w-1/2" />
      </div>

      {/* Feature pills */}
      <div className="flex gap-3 flex-wrap">
        {[80, 96, 72, 88].map((w) => (
          <div
            key={w}
            className={`h-9 bg-stone-200 rounded-xl`}
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Description block */}
      <div className="space-y-2">
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="h-4 bg-stone-100 rounded w-5/6" />
        <div className="h-4 bg-stone-200 rounded w-4/5" />
        <div className="h-4 bg-stone-100 rounded w-3/4" />
      </div>

      {/* CTA button */}
      <div className="h-12 bg-amber-100 rounded-xl w-full" />
    </div>
  </div>
);

// ── Detail pill ───────────────────────────────────────────────────────────────
const DetailPill = ({ icon, label, active = true }) => (
  <div
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold
    ${
      active
        ? "bg-stone-800 border-stone-700 text-white"
        : "bg-stone-100 border-stone-200 text-stone-400 line-through"
    }`}
  >
    <span className="text-base">{icon}</span>
    {label}
  </div>
);

const Listing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  // ✅ FIX: resolve _id vs id
  const userId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await clientBaseURL.get(
          `${clientEndPoints.getListing}/${listingId}`,
        );
        if (response.data.success) {
          setListing(response.data.data);
          // ✅ FIX: removed notify.success() here — toast on every page visit is annoying
        }
      } catch (err) {
        // ✅ FIX: optional chaining — won't crash if server is unreachable
        setError(err?.response?.data?.message || "Failed to load this listing");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <ListingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50/30 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">
            Listing Not Found
          </h2>
          <p className="text-stone-500 text-sm mb-7">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-stone-700 bg-stone-100
                         hover:bg-stone-200 rounded-xl transition-colors"
            >
              ← Go Back
            </button>
            <Link
              to="/search"
              className="px-5 py-2.5 text-sm font-semibold text-white
                         bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl
                         shadow-md shadow-amber-200 hover:shadow-amber-300 transition-all hover:-translate-y-0.5"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const displayPrice = listing.offer
    ? listing.discountPrice
    : listing.regularPrice;

  const savings = listing.offer
    ? +listing.regularPrice - +listing.discountPrice
    : 0;

  // ✅ FIX: use resolved userId, not currentUser.id (which may be undefined if _id is used)
  const isOwner = userId && listing.userRef?.toString() === userId?.toString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50/30">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      {/* ── Image Swiper ── */}
      <div className="w-full relative">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={listing.imageUrls.length > 1}
          className="w-full h-[55vh] max-h-[520px]"
        >
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="w-full h-full"
                style={{ background: `url(${url}) center/cover no-repeat` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Image count badge */}
        <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {listing.imageUrls.length} photo
          {listing.imageUrls.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Share button (fixed) ── */}
      <div className="fixed top-[13%] right-4 z-20">
        <button
          onClick={handleShare}
          className="w-11 h-11 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full
                     shadow-lg shadow-stone-200/60 flex items-center justify-center
                     hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 hover:scale-105"
          title="Copy link"
        >
          <FaShare className="text-stone-600 w-4 h-4" />
        </button>
        {copied && (
          <div className="absolute right-0 top-12 bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg">
            ✓ Link copied!
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — details */}
          <div className="lg:col-span-2 space-y-7">
            {/* Title + badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border
                  ${
                    listing.type === "rent"
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  {listing.type === "rent" ? "🔑 For Rent" : "🏠 For Sale"}
                </span>
                {listing.offer && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700">
                    🏷️ Special Offer
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-black text-stone-800 tracking-tight leading-tight mb-4">
                {listing.title}
              </h1>

              {/* Address */}
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <FaMapMarkerAlt className="text-amber-500 shrink-0" />
                <span>{listing.address}</span>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              <DetailPill
                icon="🛏️"
                label={`${listing.bedrooms} Bedroom${listing.bedrooms > 1 ? "s" : ""}`}
              />
              <DetailPill
                icon="🚿"
                label={`${listing.bathrooms} Bathroom${listing.bathrooms > 1 ? "s" : ""}`}
              />
              <DetailPill icon="🚗" label="Parking" active={listing.parking} />
              <DetailPill
                icon="🛋️"
                label="Furnished"
                active={listing.furnished}
              />
            </div>

            {/* Description card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
                About this property
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right — pricing + CTA sticky card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 p-6 space-y-5">
              {/* Price */}
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                  {listing.type === "rent" ? "Monthly Rent" : "Asking Price"}
                </p>
                <div className="flex items-end gap-2 flex-wrap">
                  <span className="text-3xl font-black text-stone-800 tracking-tight">
                    ${Number(displayPrice).toLocaleString()}
                  </span>
                  {listing.type === "rent" && (
                    <span className="text-stone-400 text-sm font-medium mb-1">
                      / month
                    </span>
                  )}
                </div>
                {listing.offer && savings > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-stone-400 line-through">
                      ${Number(listing.regularPrice).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-lg">
                      Save ${savings.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-100" />

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: <FaBed className="text-amber-500" />,
                    label: "Bedrooms",
                    value: listing.bedrooms,
                  },
                  {
                    icon: <FaBath className="text-amber-500" />,
                    label: "Bathrooms",
                    value: listing.bathrooms,
                  },
                  {
                    icon: (
                      <FaParking
                        className={
                          listing.parking ? "text-amber-500" : "text-stone-300"
                        }
                      />
                    ),
                    label: "Parking",
                    value: listing.parking ? "Yes" : "No",
                  },
                  {
                    icon: (
                      <FaChair
                        className={
                          listing.furnished
                            ? "text-amber-500"
                            : "text-stone-300"
                        }
                      />
                    ),
                    label: "Furnished",
                    value: listing.furnished ? "Yes" : "No",
                  },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-stone-50 rounded-xl p-3 flex items-center gap-2.5"
                  >
                    <span className="text-sm">{icon}</span>
                    <div>
                      <p className="text-xs text-stone-400 font-medium">
                        {label}
                      </p>
                      <p className="text-sm font-bold text-stone-700">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-100" />

              {/* CTA */}
              {!currentUser && (
                <Link
                  to="/sign-in"
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white
                             bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl
                             shadow-lg shadow-amber-200 hover:shadow-amber-300
                             transition-all duration-200 hover:-translate-y-0.5"
                >
                  Sign in to Contact Landlord
                </Link>
              )}

              {currentUser && isOwner && (
                <Link
                  to={`/update-listing/${listing._id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold
                             text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl
                             transition-all duration-200 hover:-translate-y-0.5 border border-stone-200"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Your Listing
                </Link>
              )}

              {currentUser && !isOwner && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white
                             bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl
                             shadow-lg shadow-amber-200 hover:shadow-amber-300
                             transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  Contact Landlord
                </button>
              )}

              {contact && (
                <div className="border-t border-stone-100 pt-4">
                  <Contact listing={listing} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;

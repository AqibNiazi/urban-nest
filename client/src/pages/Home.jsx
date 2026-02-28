import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clientBaseURL, clientEndPoints } from "@/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/effect-fade";
import { ListingCard } from "@/components/Search";
import { ListingGridSkeleton, SectionHeader, Stat } from "@/components/Home";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIX: Parallel fetches using Promise.all — chaining caused rent/sale to never
    // load if the offer fetch failed, and also wasted time fetching sequentially
    const fetchAll = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          clientBaseURL.get(
            `${clientEndPoints.getListings}?offer=true&limit=4`,
          ),
          clientBaseURL.get(`${clientEndPoints.getListings}?type=rent&limit=4`),
          clientBaseURL.get(`${clientEndPoints.getListings}?type=sale&limit=4`),
        ]);
        setOfferListings(offerRes?.data?.data || []);
        setRentListings(rentRes?.data?.data || []);
        setSaleListings(saleRes?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch home listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-stone-50 to-amber-50/30">
      {/* ── Ambient blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-stone-200/40 blur-3xl" />
      </div>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wide">
                Trusted by 12,000+ residents
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl lg:text-[52px] font-black text-stone-800 tracking-tight leading-[1.1]">
                Find your next{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    perfect
                  </span>
                  <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-amber-200/60 rounded-sm z-0" />
                </span>{" "}
                place with ease
              </h1>
              <p className="text-stone-500 text-base leading-relaxed max-w-105">
                Urban Nest connects you with verified properties across the
                city's most sought-after neighbourhoods — fast, simple, and
                stress-free.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/search"
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white
                           bg-linear-to-r from-amber-500 to-orange-500
                           rounded-xl shadow-lg shadow-amber-200/80
                           hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-300/80
                           transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Browse All Properties
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/search?offer=true"
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-stone-700
                           bg-white border border-stone-200 hover:border-amber-300
                           rounded-xl shadow-sm hover:shadow-md hover:text-amber-700
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                🏷️ View Offers
              </Link>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-0 pt-4 border-t border-stone-200 w-fit">
              <Stat value="12K+" label="Active Listings" />
              <div className="w-px h-10 bg-stone-200" />
              <Stat value="50+" label="Neighbourhoods" />
              <div className="w-px h-10 bg-stone-200" />
              <Stat value="98%" label="Satisfaction" />
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative lg:ml-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/50 border border-white ring-1 ring-stone-200/60">
              {loading ? (
                <div className="aspect-4/3 bg-linear-to-br from-stone-200 via-stone-100 to-amber-50 animate-pulse flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-stone-300">
                    <svg
                      className="w-12 h-12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="text-xs font-medium">
                      Loading featured…
                    </span>
                  </div>
                </div>
              ) : offerListings.length > 0 ? (
                <Swiper
                  modules={[Navigation, Autoplay, Pagination, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  navigation
                  autoplay={{ delay: 4500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  loop
                  speed={1000}
                  className="aspect-4/3"
                >
                  {offerListings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                      <Link
                        to={`/listing/${listing._id}`}
                        className="block w-full h-full"
                      >
                        <div
                          className="w-full h-full min-h-75"
                          style={{
                            background: `url(${listing?.imageUrls?.[0]}) center/cover no-repeat`,
                          }}
                        >
                          {/* Caption overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-5">
                            <p className="text-white font-bold text-sm truncate">
                              {listing.title}
                            </p>
                            <p className="text-white/80 text-xs mt-0.5">
                              $
                              {listing.offer
                                ? listing.discountPrice?.toLocaleString()
                                : listing.regularPrice?.toLocaleString()}
                              {listing.type === "rent" && " / mo"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="aspect-4/3 bg-linear-to-br from-amber-50 to-stone-50 flex items-center justify-center">
                  <p className="text-stone-400 text-sm">
                    No featured listings yet
                  </p>
                </div>
              )}
            </div>

            {/* Floating badge — bottom left */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl shadow-stone-200/70 border border-stone-100 px-4 py-3 flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200 shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-black text-stone-800">
                  Featured Offers
                </p>
                <p className="text-xs text-stone-400 font-medium">
                  Updated daily
                </p>
              </div>
            </div>

            {/* Floating badge — top right */}
            <div className="absolute -top-4 -right-4 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-300/60 px-3 py-2 text-center z-10">
              <p className="text-lg font-black leading-none">4+</p>
              <p className="text-xs font-bold opacity-80 mt-0.5">Deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature pills ── */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: "🔍",
              label: "Smart Search",
              desc: "Filter by any criteria instantly",
            },
            {
              icon: "✅",
              label: "Verified Listings",
              desc: "All properties are reviewed",
            },
            {
              icon: "📍",
              label: "Prime Locations",
              desc: "50+ sought-after neighbourhoods",
            },
            {
              icon: "💬",
              label: "Direct Contact",
              desc: "Message landlords directly",
            },
          ].map(({ icon, label, desc }) => (
            <div
              key={label}
              className="bg-white/80 backdrop-blur-sm border border-stone-100 rounded-2xl p-5
                         shadow-sm hover:shadow-lg hover:shadow-stone-200/60 hover:-translate-y-1
                         transition-all duration-300 cursor-default"
            >
              <span className="text-2xl">{icon}</span>
              <p className="text-sm font-bold text-stone-800 mt-3">{label}</p>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Listing sections ── */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
        {/* Offers */}
        {(loading || offerListings.length > 0) && (
          <section>
            <SectionHeader
              tag="Special Deals"
              title="Recent Offers"
              linkTo="/search?offer=true"
              linkLabel="View all offers"
            />
            {loading ? (
              <ListingGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {offerListings.map((l) => (
                  <ListingCard key={l._id} listing={l} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Rent */}
        {(loading || rentListings.length > 0) && (
          <section>
            <SectionHeader
              tag="For Rent"
              title="Recent Rentals"
              linkTo="/search?type=rent"
              linkLabel="View all rentals"
            />
            {loading ? (
              <ListingGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {rentListings.map((l) => (
                  <ListingCard key={l._id} listing={l} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Sale */}
        {(loading || saleListings.length > 0) && (
          <section>
            <SectionHeader
              tag="For Sale"
              title="Properties For Sale"
              linkTo="/search?type=sale"
              linkLabel="View all for sale"
            />
            {loading ? (
              <ListingGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {saleListings.map((l) => (
                  <ListingCard key={l._id} listing={l} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* CTA Banner */}
        <section className="relative overflow-hidden rounded-3xl">
          {/* Dark background with grid overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-stone-900 via-stone-800 to-stone-900" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-transparent to-orange-500/10" />

          <div className="relative z-10 px-8 py-14 text-center">
            <span
              className="inline-block text-xs font-bold text-amber-400 tracking-widest uppercase
                             border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 rounded-full mb-5"
            >
              Own a Property?
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
              Ready to sell or rent
              <br />
              your property?
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Join thousands of property owners who trust UrbanNest to connect
              them with serious buyers and reliable renters.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/create-listing"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold
                           bg-linear-to-r from-amber-500 to-orange-500 text-white
                           rounded-xl shadow-lg shadow-amber-900/40
                           hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-900/60
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create a Listing
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold
                           text-white border border-white/20 hover:border-white/40 hover:bg-white/5
                           rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
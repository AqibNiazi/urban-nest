import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ── Animated counter hook ─────────────────────────────────────────────────────
const useCounter = (target, duration = 1500, started = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
};

// ── Animated stat card ────────────────────────────────────────────────────────
const StatCard = ({ value, suffix, label, icon, started }) => {
  const count = useCounter(
    typeof value === "number" ? value : 0,
    1500,
    started,
  );
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
        {icon}
      </div>
      <p className="text-3xl font-black text-stone-800 tracking-tight">
        {typeof value === "number" ? count : value}
        {suffix}
      </p>
      <p className="text-sm text-stone-500 font-medium mt-1">{label}</p>
    </div>
  );
};

// ── Value card ────────────────────────────────────────────────────────────────
const ValueCard = ({ icon, title, desc, accent }) => (
  <div
    className={`relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border shadow-sm p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${accent}`}
  >
    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 opacity-60" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 text-2xl shadow-md shadow-amber-200">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const About = () => {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50/30">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full px-4 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Our Story
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-5">
            Reimagining the way
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              people find home
            </span>
          </h1>
          <p className="text-stone-300 text-base leading-relaxed max-w-2xl mx-auto">
            Urban Nest was built on a simple belief — finding a home should feel
            like an exciting new chapter, not an overwhelming ordeal.
          </p>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Who We Are
              </span>
            </div>
            <h2 className="text-3xl font-black text-stone-800 tracking-tight">
              A platform built for modern real estate
            </h2>
            <p className="text-stone-500 leading-relaxed text-sm">
              Urban Nest is a modern real estate platform designed to make
              buying, selling, and renting properties simple, fast, and
              reliable. We believe finding a home should be an exciting journey,
              not a stressful one.
            </p>
            <p className="text-stone-500 leading-relaxed text-sm">
              Whether you are searching for a cozy apartment, a family house, or
              an investment opportunity, Urban Nest connects you with the best
              listings tailored to your needs — backed by verified data and a
              team that genuinely cares.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/search"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white
                           bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl
                           shadow-md shadow-amber-200 hover:shadow-amber-300
                           transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse Properties
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/create-listing"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-stone-700
                           bg-white border border-stone-200 hover:border-stone-300 rounded-xl
                           shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                List a Property
              </Link>
            </div>
          </div>

          {/* Image panel */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/40 border border-white ring-1 ring-stone-200/40 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop"
                alt="Modern property"
                className="w-full h-full object-cover"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
            </div>
            {/* Floating tag */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl border border-stone-100 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200 text-white shrink-0">
                🏙️
              </div>
              <div>
                <p className="text-xs font-black text-stone-800">50+ Cities</p>
                <p className="text-xs text-stone-400">Across the country</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-3xl p-10 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 rounded-full">
              Our Mission
            </span>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mt-5 mb-4">
              Transparency at every step
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Our mission is to provide a transparent, user-friendly, and
              trustworthy real estate experience. We empower users with accurate
              information, powerful search tools, and a smooth browsing
              experience so they can make confident property decisions — every
              time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              By The Numbers
            </span>
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">
            Urban Nest at a glance
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard
            value={12000}
            suffix="+"
            label="Active Listings"
            icon="🏠"
            started={statsVisible}
          />
          <StatCard
            value={50}
            suffix="+"
            label="Neighbourhoods"
            icon="📍"
            started={statsVisible}
          />
          <StatCard
            value={98}
            suffix="%"
            label="Satisfaction Rate"
            icon="⭐"
            started={statsVisible}
          />
          <StatCard
            value={5000}
            suffix="+"
            label="Families Housed"
            icon="👨‍👩‍👧"
            started={statsVisible}
          />
        </div>
      </section>

      {/* ── Values ── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Core Values
            </span>
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">
            What drives us every day
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ValueCard
            icon="🤝"
            title="Trust"
            desc="Verified listings and transparent information you can rely on — no surprises, no hidden details."
            accent="border-stone-100"
          />
          <ValueCard
            icon="💡"
            title="Simplicity"
            desc="Clean, intuitive design with smart search to find the perfect property without the overwhelm."
            accent="border-amber-100/60"
          />
          <ValueCard
            icon="🎧"
            title="Support"
            desc="A dedicated team walking alongside you at every step of your real estate journey."
            accent="border-stone-100"
          />
          <ValueCard
            icon="🔒"
            title="Privacy"
            desc="Your personal data is yours. We never sell it and always keep it secure."
            accent="border-stone-100"
          />
          <ValueCard
            icon="⚡"
            title="Speed"
            desc="Instant search results, fast listings, quick landlord contact — time is precious."
            accent="border-amber-100/60"
          />
          <ValueCard
            icon="🌍"
            title="Community"
            desc="We believe in the power of neighbourhoods and building connections that last."
            accent="border-stone-100"
          />
        </div>
      </section>

      {/* ── Team CTA ── */}
      <section className="max-w-5xl mx-auto px-4 py-12 pb-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 p-10 text-center">
          <div className="flex -space-x-3 justify-center mb-5">
            {["🧑‍💼", "👩‍💼", "🧑‍🔧", "👩‍🎨"].map((e, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-100 to-amber-50 border-2 border-white shadow-md flex items-center justify-center text-xl"
              >
                {e}
              </div>
            ))}
          </div>
          <h3 className="text-xl font-black text-stone-800 mb-2">
            Ready to find your next home?
          </h3>
          <p className="text-stone-500 text-sm mb-7 max-w-md mx-auto">
            Join thousands of happy residents who found their perfect place
            through Urban Nest.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white
                       bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl
                       shadow-lg shadow-amber-200 hover:shadow-amber-300
                       transition-all duration-200 hover:-translate-y-0.5"
          >
            Start Browsing
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
        </div>
      </section>
    </div>
  );
};

export default About;

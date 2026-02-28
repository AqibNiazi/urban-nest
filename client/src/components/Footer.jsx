import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navGroups = [
    {
      heading: "Explore",
      links: [
        { label: "Browse All Properties", to: "/search" },
        { label: "For Sale", to: "/search?type=sale" },
        { label: "For Rent", to: "/search?type=rent" },
        { label: "Special Offers", to: "/search?offer=true" },
      ],
    },
    {
      heading: "Account",
      links: [
        { label: "Sign In", to: "/sign-in" },
        { label: "Sign Up", to: "/sign-up" },
        { label: "My Profile", to: "/profile" },
        { label: "Create Listing", to: "/create-listing" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "How It Works", to: "/about" },
        { label: "Contact", to: "/about" },
        { label: "Careers", to: "/about" },
      ],
    },
  ];

  return (
    <footer className="relative bg-stone-900 overflow-hidden mt-auto">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Amber glow top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />

      {/* Ambient blobs */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-14 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-900/40">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Urban<span className="text-amber-400">Nest</span>
              </span>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Connecting people with their perfect properties. Verified
              listings, smart search, and seamless landlord contact — all in one
              place.
            </p>

            {/* Feature mini-tags */}
            <div className="flex flex-wrap gap-2">
              {["🏠 12K+ Listings", "📍 50+ Areas", "✅ Verified"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-stone-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  label: "Twitter",
                  path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                },
                {
                  label: "Instagram",
                  path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z",
                },
                {
                  label: "LinkedIn",
                  path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
                },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center
                             text-stone-400 hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5
                             transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map(({ heading, links }) => (
            <div key={heading} className="space-y-4">
              <h3 className="text-xs font-black text-stone-200 uppercase tracking-widest">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-stone-400 hover:text-amber-400 transition-colors duration-150 flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-amber-400 transition-colors shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div className="py-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold text-white">Stay in the loop</p>
              <p className="text-xs text-stone-400 mt-0.5">
                New listings and market updates directly to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 bg-white/5 border border-white/10 text-stone-300 text-sm
                           placeholder:text-stone-600 rounded-xl px-4 py-2.5
                           focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50
                           transition-all duration-200"
              />
              <button
                className="px-4 py-2.5 text-sm font-bold text-white
                           bg-linear-to-r from-amber-500 to-orange-500
                           hover:from-amber-400 hover:to-orange-400
                           rounded-xl shadow-md shadow-amber-900/30 transition-all duration-200
                           hover:-translate-y-0.5 whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 font-medium">
            © {currentYear} UrbanNest. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-xs text-stone-500 hover:text-stone-300 transition-colors duration-150"
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

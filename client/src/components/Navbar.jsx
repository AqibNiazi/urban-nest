import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Sync search term from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("searchTerm");
    if (term) setSearchTerm(term);
    else setSearchTerm("");
  }, [location.search]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ FIX: Preserve existing search params (type, parking, etc.) when searching from navbar
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) {
      params.set("searchTerm", searchTerm.trim());
    } else {
      params.delete("searchTerm");
    }
    navigate(`/search?${params.toString()}`);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-amber-600 font-semibold"
      : "text-stone-600 hover:text-stone-900";

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 transition-shadow duration-300
        ${scrolled ? "shadow-md shadow-stone-200/60" : "shadow-none"}`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tight text-stone-800 hidden sm:block">
            Urban<span className="text-amber-500">Nest</span>
          </span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-sm">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3.5 text-stone-400 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties…"
              className="w-full bg-stone-100 border border-stone-200 text-stone-800 text-sm
                         rounded-xl pl-9 pr-4 py-2.5
                         placeholder:text-stone-400
                         focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                         focus:bg-white hover:bg-stone-50 transition-all duration-200"
            />
            {/* Search trigger on mobile */}
            <button
              type="submit"
              className="sm:hidden absolute right-2.5 w-6 h-6 bg-amber-500 text-white rounded-lg flex items-center justify-center"
            >
              <FaSearch className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`hidden sm:flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 ${isActive("/")}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`hidden sm:flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 ${isActive("/about")}`}
          >
            About
          </Link>

          {currentUser ? (
            <Link to="/profile" className="ml-1">
              <div className="relative">
                <img
                  src={currentUser?.avatar}
                  alt="profile"
                  referrerPolicy="no-referrer"
                  className={`w-9 h-9 rounded-full object-cover ring-2 transition-all duration-200
                    ${
                      location.pathname === "/profile"
                        ? "ring-amber-400 shadow-md shadow-amber-200"
                        : "ring-stone-200 hover:ring-amber-300"
                    }`}
                />
                {/* Online dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              </div>
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="ml-1 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-amber-500 to-orange-500
                         rounded-xl shadow-md shadow-amber-200 hover:shadow-amber-300
                         hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

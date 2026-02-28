// ── Reusable Section Header ───────────────────────────────────────────────────
import { Link } from "react-router-dom";
const SectionHeader = ({ tag, title, linkTo, linkLabel }) => (
  <div className="flex items-end justify-between mb-7">
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-1 h-4 rounded-full bg-linear-to-b from-amber-400 to-orange-500" />
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
          {tag}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-stone-800 tracking-tight">
        {title}
      </h2>
    </div>
    <Link
      to={linkTo}
      className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700
                 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300
                 px-3.5 py-2 rounded-xl transition-all duration-150 group"
    >
      {linkLabel}
      <svg
        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
);

export default SectionHeader;

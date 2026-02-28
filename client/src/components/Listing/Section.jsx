import React from "react";

// ── Shared section wrapper ───────────────────────────────────────────────────
const Section = ({ step, title, description, children }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm shadow-stone-200/50 overflow-hidden">
    <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-sm shadow-amber-200 shrink-0">
        {step}
      </span>
      <div>
        <h2 className="text-sm font-bold text-stone-800">{title}</h2>
        {description && (
          <p className="text-xs text-stone-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

export default Section;

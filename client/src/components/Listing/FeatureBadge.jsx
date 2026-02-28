// ── Feature badge ────────────────────────────────────────────────────────────
const FeatureBadge = ({ id, checked, onChange, label, icon }) => (
  <button
    type="button"
    onClick={() =>
      onChange({ target: { id, type: "checkbox", checked: !checked } })
    }
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer
      ${
        checked
          ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm shadow-amber-100"
          : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
      }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    {checked && (
      <svg
        className="w-3.5 h-3.5 text-amber-500 ml-0.5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    )}
  </button>
);

export default FeatureBadge;

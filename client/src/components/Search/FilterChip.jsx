// ── Filter chip ──────────────────────────────────────────────────────────────
const FilterChip = ({ id, label, icon, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange({ target: { id, checked: !checked } })}
    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer
      ${
        checked
          ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm shadow-amber-100"
          : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
      }`}
  >
    {icon && <span>{icon}</span>}
    {label}
    {checked && (
      <svg
        className="w-3 h-3 text-amber-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    )}
  </button>
);

export default FilterChip;

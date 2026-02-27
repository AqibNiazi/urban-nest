// ── Sale / Rent toggle ───────────────────────────────────────────────────────
const TypeToggle = ({ value, onChange }) => (
  <div className="inline-flex rounded-xl border border-stone-200 bg-stone-50 p-1 gap-1">
    {["sale", "rent"].map((t) => (
      <button
        key={t}
        type="button"
        onClick={() =>
          onChange({ target: { id: t, type: "checkbox", checked: true } })
        }
        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 capitalize
          ${
            value === t
              ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200"
              : "text-stone-500 hover:text-stone-700"
          }`}
      >
        {t === "sale" ? "🏠 For Sale" : "🔑 For Rent"}
      </button>
    ))}
  </div>
);

export default TypeToggle;

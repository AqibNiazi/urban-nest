// ── Submit panel ─────────────────────────────────────────────────────────────
const SubmitPanel = ({
  formData,
  loading,
  uploading,
  error,
  submitLabel,
  submitIcon,
}) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm p-6 space-y-3">
    {/* Summary rows */}
    {[
      {
        label: "Photos uploaded",
        value: `${formData.imageUrls.length} / 6`,
        highlight: formData.imageUrls.length > 0,
      },
      { label: "Listing type", value: formData.type, capitalize: true },
      {
        label: "Regular price",
        value:
          formData.regularPrice > 0
            ? `$${Number(formData.regularPrice).toLocaleString()}${formData.type === "rent" ? " /mo" : ""}`
            : "—",
      },
    ].map(({ label, value, highlight, capitalize }) => (
      <div
        key={label}
        className="flex items-center justify-between text-xs text-stone-500 pb-3 border-b border-stone-100"
      >
        <span>{label}</span>
        <span
          className={`font-semibold ${highlight ? "text-amber-600" : "text-stone-700"} ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </span>
      </div>
    ))}

    {/* Error */}
    {error && (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2.5">
        <svg
          className="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        {error}
      </div>
    )}

    {/* Submit button */}
    <button
      type="submit"
      disabled={loading || uploading}
      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white
                 bg-linear-to-r from-amber-500 to-orange-500
                 hover:from-amber-600 hover:to-orange-600
                 rounded-xl shadow-lg shadow-amber-200 hover:shadow-amber-300
                 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
    >
      {loading ? (
        <>
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Processing…
        </>
      ) : (
        <>
          {submitIcon}
          {submitLabel}
        </>
      )}
    </button>
  </div>
);

export default SubmitPanel;

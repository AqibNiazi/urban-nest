// ── Stat item ─────────────────────────────────────────────────────────────────
const Stat = ({ value, label }) => (
  <div className="text-center px-6">
    <p className="text-2xl font-black text-stone-800">{value}</p>
    <p className="text-xs text-stone-500 mt-0.5 font-medium">{label}</p>
  </div>
);

export default Stat;

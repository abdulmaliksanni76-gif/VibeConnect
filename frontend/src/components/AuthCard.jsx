export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="w-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="text-slate-300 mt-2 text-sm">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
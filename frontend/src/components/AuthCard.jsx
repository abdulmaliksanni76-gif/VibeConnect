// // src/components/AuthCard.jsx
// export function AuthCard({ title, subtitle, children }) {
//   return (
//     <div className="w-full max-w-[360px] p-6 bg-[#111B29] border border-slate-800 rounded-[1.5rem] shadow-2xl">
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-white">{title}</h2>
//         <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
//       </div>
//       {children}
//     </div>
//   );
// }

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
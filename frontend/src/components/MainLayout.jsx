export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#0B1220] flex items-center justify-center p-4 selection:bg-[#0F766E]/30">
      <div className="relative w-full max-w-[400px]">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#0F766E] rounded-full blur-[128px] opacity-10 pointer-events-none"></div>
        {children}
      </div>
    </div>
  );
}
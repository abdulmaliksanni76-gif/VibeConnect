export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#0B1220] relative overflow-hidden transition-colors duration-300">
      {/* Decorative Gradient Overlay for depth */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, #0F766E 0%, transparent 70%)'
           }}>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
// // export default function Layout({ children }) {
// //   return (
// //     <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center p-4">
// //       {children}
// //     </div>
// //   );
// // }

// // src/components/Layout.jsx
// export default function Layout({ children }) {
//   return (
//     <div className="h-screen w-full bg-[#0B1220] text-white flex overflow-hidden">
//       {/* Sidebar - Similar to WhatsApp sidebar */}
//       <div className="w-[350px] border-r border-[#1f2c33] flex flex-col">
//         {/* Sidebar content (User profile, search, etc.) */}
//       </div>
      
//       {/* Main View - Where your Auth/Chat pages will live */}
//       <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
//         {children}
//       </div>
//     </div>
//   );
// }

// src/components/MainLayout.jsx
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
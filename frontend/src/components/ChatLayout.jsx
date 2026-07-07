import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Using React Router for navigation
import Sidebar from './Sidebar';
import './ChatLayout.css';

// const ChatLayout = () => {
//   // On mobile, we toggle between 'sidebar' and 'chat'
//   const [mobileView, setMobileView] = useState('sidebar');

//   return (
//     <div className="app-main-layout">
//       {/* Sidebar: Always visible on Desktop, conditionally on Mobile */}
//       <div className={`sidebar-container ${mobileView === 'chat' ? 'hide-mobile' : ''}`}>
//         <Sidebar onSelectChat={() => setMobileView('chat')} />
//       </div>

//       {/* Main Window: Chat Window */}
//       <div className={`chat-window-container ${mobileView === 'sidebar' ? 'hide-mobile' : ''}`}>
//         <Outlet context={{ goBack: () => setMobileView('sidebar') }} />
//       </div>
//     </div>
//   );
// };
const ChatLayout = () => {
  const [mobileView, setMobileView] = useState('sidebar');

  return (
    <div className="app-main-layout">
      <div className={`sidebar-container ${mobileView === 'chat' ? 'hide-mobile' : ''}`}>
        <Sidebar onSelectChat={() => setMobileView('chat')} />
      </div>

      <div className={`chat-window-container ${mobileView === 'sidebar' ? 'hide-mobile' : ''}`}>
        {/* Pass the goBack function here using the context prop */}
        <Outlet context={{ goBack: () => setMobileView('sidebar') }} />
      </div>
    </div>
  );
};

export default ChatLayout;
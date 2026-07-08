// // import React, { useState } from 'react';
// // import { Outlet } from 'react-router-dom'; // Using React Router for navigation
// // import Sidebar from './Sidebar';
// // import './ChatLayout.css';

// // const ChatLayout = () => {
// //   const [mobileView, setMobileView] = useState('sidebar');

// //   return (
// //     <div className="app-main-layout">
// //       <div className={`sidebar-container ${mobileView === 'chat' ? 'hide-mobile' : ''}`}>
// //         <Sidebar onSelectChat={() => setMobileView('chat')} />
// //       </div>

// //       <div className={`chat-window-container ${mobileView === 'sidebar' ? 'hide-mobile' : ''}`}>
// //         {/* Pass the goBack function here using the context prop */}
// //         <Outlet context={{ goBack: () => setMobileView('sidebar') }} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatLayout;

// // import React from 'react';
// // import { Outlet, useParams } from 'react-router-dom';
// // import Sidebar from './Sidebar';
// // import './ChatLayout.css';

// // const ChatLayout = () => {
// //   const { conversationId } = useParams();

// //   return (
// //     <div className="app-main-layout">
// //       {/* Sidebar - hides on mobile when conversationId exists */}
// //       <div className={`sidebar-container ${conversationId ? 'hide-mobile' : ''}`}>
// //         <Sidebar />
// //       </div>

// //       {/* Main Window */}
// //       <div className={`chat-window-container ${!conversationId ? 'hide-mobile' : ''}`}>
// //         {conversationId ? (
// //           <Outlet />
// //         ) : (
// //           <div className="empty-chat-placeholder">
// //             <div className="placeholder-content">
// //               <h2>Vibeconnect for Windows</h2>
// //               <p>Select a chat to start messaging.</p>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ChatLayout;

// import React from 'react';
// import { Outlet, useParams } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import './ChatLayout.css';

// const ChatLayout = () => {
//   const { conversationId } = useParams();

//   return (
//     <div className="app-main-layout">
//       {/* Sidebar: Always visible on desktop, hidden on mobile if chat is active */}
//       <div className={`sidebar-container ${conversationId ? 'hide-mobile' : ''}`}>
//         <Sidebar />
//       </div>

//       {/* Main Window */}
//       <div className={`chat-window-container ${!conversationId ? 'hide-mobile' : ''}`}>
//         {conversationId ? (
//           <Outlet />
//         ) : (
//           <div className="empty-chat-placeholder">
            // <div className="placeholder-content">
            //   <h2>Vibeconnect for Windows</h2>
            //   <p>Grow, organise and manage your business account.</p>
            // </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;

import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './ChatLayout.css';

const ChatLayout = () => {
  const { conversationId } = useParams();
  return (
    <div className="app-main-layout">
      <div className={`sidebar-container ${conversationId ? 'hide-mobile' : ''}`}>
        <Sidebar />
      </div>
      <div className={`chat-window-container ${!conversationId ? 'hide-mobile' : ''}`}>
        {conversationId ? <Outlet /> : (
          <div className="empty-chat-placeholder">
            <div className="placeholder-content">
              <h2>Vibeconnect for Windows</h2>
              <p>Grow, organise and manage your business account.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatLayout;
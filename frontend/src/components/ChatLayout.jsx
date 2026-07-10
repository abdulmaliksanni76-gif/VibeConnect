import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './ChatLayout.css';
import Vibeconnect from '../assets/Vibe Connect-3.png';

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
              <img src={Vibeconnect} alt="Logo" className="chat-logo" />
              <h2>Vibeconnect for Windows</h2>
              <p>Select a chat to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatLayout;
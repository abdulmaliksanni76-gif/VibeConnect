import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Success from './pages/Success';
import Login from './pages/Login';
import Chat from './pages/Chat';
import ChatLayout from './components/ChatLayout';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  // This code is fine, but double check if there are any other hidden useEffects
// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoading(false);
//   }, 2000);
//   return () => clearTimeout(timer);
// }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/chat" element={<ChatLayout />}>
          <Route path=":conversationId" element={<Chat />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
}

export default App;
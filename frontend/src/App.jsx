// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Register from './pages/Register';
// import Verify from './pages/Verify';
// import Success from './pages/Success';
// import Login from './pages/Login';
// import Chat from './pages/Chat';
// import Layout from './components/Layout';
// import ChatLayout from './components/ChatLayout';



// function App() {


// return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/verify" element={<Verify />} />
//         <Route path="/success" element={<Success />} />
//         <Route path="/login" element={<Login />} />
        
//         {/* Correct Nested Route: Access via /chat/:conversationId */}
//         <Route path="/chat" element={<ChatLayout />}>
//           <Route path=":conversationId" element={<Chat />} />
//         </Route>
        
//         <Route path="/" element={<Navigate to="/register" />} />
//       </Routes>
//     </Router>
//   );
// }
// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Success from './pages/Success';
import Login from './pages/Login';
import Chat from './pages/Chat';
import ChatLayout from './components/ChatLayout';
import SplashScreen from './components/SplashScreen'; // Ensure this path is correct

function App() {
  const [loading, setLoading] = useState(true);

  // This effect ensures the splash screen shows for 2 seconds when the app loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        
        {/* Nested Route: Access via /chat/:conversationId */}
        <Route path="/chat" element={<ChatLayout />}>
          <Route path=":conversationId" element={<Chat />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Success from './pages/Success';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Layout from './components/Layout';
import ChatLayout from './components/ChatLayout';



function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
//         <Routes>
//           <Route path="/register" element={<Register />} />
//           <Route path="/verify" element={<Verify />} />
//           <Route path="/success" element={<Success />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/chat" element={<Chat />} />
//           <Route path="/" element={<Navigate to="/register" />} />
//           {/* <Route path="/" element={<ChatLayout />}>
//             <Route path="chat/:conversationId" element={<Chat />} />
//           </Route> */}
//           <Route path="chat" element={<ChatLayout />}>
//             <Route index element={<div>Select a chat to start</div>} />
//             <Route path=":conversationId" element={<Chat />} />
//             <Route path="chat/:conversationId" element={<Chat />} />
//           </Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// }

return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        
        {/* Correct Nested Route: Access via /chat/:conversationId */}
        <Route path="/chat" element={<ChatLayout />}>
          <Route path=":conversationId" element={<Chat />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
}
export default App;
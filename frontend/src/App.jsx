import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Success from './pages/Success';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Layout from './components/Layout';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';

// function Login() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

// const handleLogin = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);
//   try {
//     const { data } = await axios.post('http://localhost:5000/api/auth/login', formData);
    
//     // Add this to verify what you're receiving
//     console.log("Response data from server:", data); 

//     localStorage.setItem('token', data.token);
//     // If 'data.username' is undefined, it means the backend change above didn't save
//     localStorage.setItem('userName', data.username); 
    
//     navigate('/chat');
//   } catch (err) {
//     // ...
//   }
// };

// return (
//     <div className="glass-card">
//       <form onSubmit={handleLogin}>
//         <h3 className="text-white text-center mb-4 fw-bold">Welcome Back</h3>
        
//         <div className="glass-input-group d-flex align-items-center">
//           <Mail size={20} className="text-primary me-3" />
//           <input 
//             className="form-control bg-transparent border-0 text-white shadow-none" 
//             placeholder="Email" 
//             required
//             onChange={(e) => setFormData({...formData, email: e.target.value})} 
//           />
//         </div>

//         <div className="glass-input-group d-flex align-items-center mb-4">
//           <Lock size={20} className="text-primary me-3" />
//           <input 
//             className="form-control bg-transparent border-0 text-white shadow-none" 
//             type="password" 
//             placeholder="Password" 
//             required
//             onChange={(e) => setFormData({...formData, password: e.target.value})} 
//           />
//         </div>

//         <button className="custom-btn w-100" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Logging in...' : 'Login'}
//         </button>
//       </form>

//       <p className="text-center text-white-50 mt-4 small">
//         Don't have an account? <Link to="/register" className="text-primary text-decoration-none">Create one</Link>
//       </p>
//     </div>
//   );
// }

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Reset error on new attempt
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // Ensure backend returns 'username'
      
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false); // ALWAYS reset this, success or fail
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username'); // Clear this too!
  navigate('/login');
};

  return (
    <div className="glass-card">
      <form onSubmit={handleLogin}>
        <h3 className="text-white text-center mb-4 fw-bold">Welcome Back</h3>
        
        {error && <p className="text-danger text-center">{error}</p>} {/* Display error */}

        <div className="glass-input-group d-flex align-items-center">
          <Mail size={20} className="text-primary me-3" />
          <input 
            className="form-control bg-transparent border-0 text-white shadow-none" 
            placeholder="Email" 
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
        </div>

        <div className="glass-input-group d-flex align-items-center mb-4">
          <Lock size={20} className="text-primary me-3" />
          <input 
            className="form-control bg-transparent border-0 text-white shadow-none" 
            type="password" 
            placeholder="Password" 
            required
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
        </div>

        <button className="custom-btn w-100" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center text-white-50 mt-4 small">
         Don't have an account? <Link to="/register" className="text-primary text-decoration-none">Create one</Link>
      </p>
    </div>
  );
}

export default Login;
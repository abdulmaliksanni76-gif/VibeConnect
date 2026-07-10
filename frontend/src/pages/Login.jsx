import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      const { data } = response;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId); 
      localStorage.setItem('username', data.username);
      
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false); 
    }
};

  return (
    <div className="glass-card">
      <form onSubmit={handleLogin}>
        <h3 className="text-white text-center mb-4 fw-bold">Welcome Back</h3>
        
        {error && <p className="text-danger text-center">{error}</p>}

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
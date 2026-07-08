import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { registerUser } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // ADDED THIS LINE
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Reset error before new attempt
    try {
      await registerUser(formData);
      navigate('/verify', { state: { email: formData.email } });
    } catch (error) {
      setError(error.response?.data?.message || 'Registration Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card">
      <form onSubmit={handleSubmit}>
        <h3 className="text-white text-center mb-4 fw-bold">Create Account</h3>
        
        {error && <div className="alert alert-danger p-2 mb-3 small text-center">{error}</div>}

        <div className="glass-input-group d-flex align-items-center">
          <User size={20} className="text-primary me-3" />
          <input 
            className="form-control bg-transparent border-0 text-white shadow-none" 
            placeholder="Username" 
            required
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
          />
        </div>

        <div className="glass-input-group d-flex align-items-center">
          <Mail size={20} className="text-primary me-3" />
          <input 
            className="form-control bg-transparent border-0 text-white shadow-none" 
            placeholder="Email Address" 
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
          {isSubmitting ? 'Processing...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-white-50 mt-4 small">
        Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login here</Link>
      </p>
    </div>
  );
}
export default Register;
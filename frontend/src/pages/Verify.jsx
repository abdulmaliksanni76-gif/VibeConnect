import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Verify() {
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtpArray = [...otpArray];
      newOtpArray[index] = value;
      setOtpArray(newOtpArray);
      if (value !== '' && index < 5) document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, { email, otp: otpArray.join('') });
      navigate('/success');
    } catch (error) {
      alert('Verification Failed');
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, { email });
      alert('A new code has been sent to your email.');
    } catch (error) {
      alert('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="glass-card p-5" style={{ width: '100%', maxWidth: '480px' }}>
      <div className="text-center">
        <h3 className="text-white mb-3 fw-bold">Verify Email</h3>
        <p className="text-white-50 small mb-4">We've sent a code to your email.</p>
        
        <div className="d-flex justify-content-center gap-2 mb-4">
          {otpArray.map((digit, index) => (
          <input 
            key={index} 
            id={`otp-${index}`} 
            type="text" 
            maxLength="1" 
            className="form-control text-center fs-3 otp-input text-white shadow-none" 
            style={{ width: '55px', height: '65px', padding: '0', fontSize: '1.5rem', borderRadius: '12px' }} 
            value={digit} 
            onChange={(e) => handleOtpChange(e, index)} 
          />
        ))}
        </div>

        <button onClick={handleVerify} className="custom-btn w-100 mb-3">Verify Account</button>
        
        <p className="text-white-50 small mt-3">
          Didn't receive the code?{' '}
          <button 
            onClick={handleResend} 
            className="btn btn-link p-0 border-0 text-primary text-decoration-none" 
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend it'}
          </button>
        </p>
      </div>
    </div>
  );
}
export default Verify;
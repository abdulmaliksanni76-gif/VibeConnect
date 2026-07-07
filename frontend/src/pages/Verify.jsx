// import { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Verify() {
//   const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email;

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]$/.test(value) || value === '') {
//       const newOtpArray = [...otpArray];
//       newOtpArray[index] = value;
//       setOtpArray(newOtpArray);
//       if (value !== '' && index < 5) document.getElementById(`otp-${index + 1}`).focus();
//     }
//   };

//   const handleVerify = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp: otpArray.join('') });
//       navigate('/success');
//     } catch (error) {
//       alert('Verification Failed');
//     }
//   };

//   const [resending, setResending] = useState(false);

// const handleResend = async () => {
//   setResending(true);
//   try {
//     // You'll need a route on your backend that triggers sending the OTP again
//     await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
//     alert('A new code has been sent to your email.');
//   } catch (error) {
//     alert('Failed to resend. Please try again.');
//   } finally {
//     setResending(false);
//   }
// };

//   return (
//     <div className="card shadow-sm border-0 rounded-4 p-5" style={{ width: '100%', maxWidth: '450px' }}>
//       <div className="text-center">
//         <h4 className="mb-2 fw-bold">Verify your email</h4>
//         <p className="text-muted small mb-4">Code sent to <strong>{email}</strong></p>
//         <div className="d-flex justify-content-center gap-2 mb-4">
//           {otpArray.map((digit, index) => (
//             <input key={index} id={`otp-${index}`} type="text" maxLength="1" className="form-control text-center fs-3 p-0" style={{ width: '50px', height: '60px', borderRadius: '10px' }} value={digit} onChange={(e) => handleOtpChange(e, index)} />
//           ))}
//         </div>
//         <button onClick={handleVerify} className="btn btn-success w-100 rounded-3 py-2">Verify Account</button>
//         <div className="mt-3">
//         <p className="text-muted small">
//             Didn't receive the code?{' '}
//             <button 
//             onClick={handleResend} 
//             className="btn btn-link p-0 border-0" 
//             disabled={resending}
//             >
//             {resending ? 'Sending...' : 'Resend it'}
//             </button>
//         </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Verify;

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
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp: otpArray.join('') });
      navigate('/success');
    } catch (error) {
      alert('Verification Failed');
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      alert('A new code has been sent to your email.');
    } catch (error) {
      alert('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    // Width set to 100% and maxWidth increased to 480px to match Login/Register
    <div className="glass-card p-5" style={{ width: '100%', maxWidth: '480px' }}>
      <div className="text-center">
        <h3 className="text-white mb-3 fw-bold">Verify Email</h3>
        <p className="text-white-50 small mb-4">We've sent a code to your email.</p>
        
        <div className="d-flex justify-content-center gap-2 mb-4">
          {/* {otpArray.map((digit, index) => (
            <input 
              key={index} 
              id={`otp-${index}`} 
              type="text" 
              maxLength="1" 
              className="form-control text-center fs-3 glass-input-group text-white shadow-none" 
              style={{ width: '55px', height: '65px', padding: '0', fontSize: '1.5rem' }} 
              value={digit} 
              onChange={(e) => handleOtpChange(e, index)} 
            />
          ))} */}
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
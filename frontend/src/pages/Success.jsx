// import { useNavigate } from 'react-router-dom';

// function Success() {
//   const navigate = useNavigate();

//   return (
//     <div className="card shadow-sm border-0 rounded-4 p-5" style={{ width: '100%', maxWidth: '450px' }}>
//       <div className="text-center py-4">
//         <h3 className="fw-bold text-success">Welcome!</h3>
//         <p className="text-muted">Your account is active.</p>
//         <button className="btn btn-primary" onClick={() => navigate('/chat')}>Go to Chat</button>
//       </div>
//     </div>
//   );
// }
// export default Success;

import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function Success() {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-5 text-center" style={{ width: '100%', maxWidth: '480px' }}>
      <div className="py-4">
        <div className="d-flex justify-content-center mb-3">
          <CheckCircle size={64} className="text-success" />
        </div>
        <h3 className="fw-bold text-white mb-2">Welcome!</h3>
        <p className="text-white-50 mb-4">Your account is now active and ready to use.</p>
        <button 
          className="custom-btn w-100" 
          onClick={() => navigate('/chat')}
        >
          Go to Chat
        </button>
      </div>
    </div>
  );
}
export default Success;
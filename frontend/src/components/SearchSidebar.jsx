import React, { useState } from 'react';
import axios from 'axios';

function SearchSidebar({ onSelectUser }) {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setError('');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?email=${email}`);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError('User not found.');
    }
  };

  return (
    <div className="p-3">
      <h5 className="text-white mb-3">Search Users</h5>
      <div className="input-group mb-3">
        <input 
          type="email" 
          className="form-control rounded-3" 
          placeholder="Enter email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary rounded-3" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}
      
      {result && (
        <div 
          className="p-3 bg-dark text-white rounded-3 cursor-pointer" 
          style={{ border: '1px solid #444', cursor: 'pointer' }}
          onClick={() => onSelectUser(result)}
        >
          {result.username}
          <div className="text-muted small">{result.email}</div>
        </div>
      )}
    </div>
  );
}

export default SearchSidebar;
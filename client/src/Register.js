import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok && data.message && data.message.toLowerCase().includes('success')) {
        setTimeout(() => navigate('/login'), 1000); // short delay to show message
      }
    } catch (err) {
      setMessage('Error registering');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl flex flex-col gap-6 border border-green-200">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-green-700 tracking-tight">Create Account</h2>
        <p className="text-center text-gray-500 mb-4">Sign up to get started!</p>
        <input
          type="text"
          placeholder="Enter a Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition"
        />
        <input
          type="password"
          placeholder="Enter a Strong Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg transition"
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition text-lg shadow">Register</button>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="text-gray-500">Already have an account?</span>
          <button type="button" onClick={() => navigate('/login')} className="text-green-600 hover:underline font-semibold bg-transparent border-none cursor-pointer p-0">Login</button>
        </div>
        {message && <p className={`text-center text-base mt-2 ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
      </form>
    </div>
  );
}

export default Register;

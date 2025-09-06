import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await register(email, password);
      navigate('/');
    } catch {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="rounded-4 shadow-lg p-4"
        style={{
          width: '400px',
          maxWidth: '90%',
          position: 'relative',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
          onClick={() => navigate('/')}
        ></button>

        <h3 className="mb-4 text-center fw-bold text-white">Create an Account</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-white small">Email</label>
            <input
              type="email"
              className="form-control bg-transparent text-white border-light"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="text-white small">Password</label>
            <input
              type="password"
              className="form-control bg-transparent text-white border-light"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="text-white small">Confirm Password</label>
            <input
              type="password"
              className="form-control bg-transparent text-white border-light"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{
              background: 'rgba(46,204,113,0.8)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            Sign Up
          </button>
        </form>

        <p className="mt-3 text-center text-white small">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

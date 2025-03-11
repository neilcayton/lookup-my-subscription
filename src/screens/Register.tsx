import React, { useState, useEffect } from 'react';
import { register } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const navigate = useNavigate();

  // Check if Firebase is properly initialized
  useEffect(() => {
    try {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, () => {
        console.log("Firebase Auth is initialized");
        setFirebaseInitialized(true);
      }, (error) => {
        console.error("Firebase Auth initialization error:", error);
        setError(`Firebase initialization error: ${error.message}`);
      });
      
      return () => unsubscribe();
    } catch (err: any) {
      console.error("Firebase setup error:", err);
      setError(`Firebase setup error: ${err.message}`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firebaseInitialized) {
      setError('Firebase authentication is not initialized yet. Please try again in a moment.');
      return;
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      console.log("Attempting to register with email:", email);
      await register(email, password);
      console.log("Registration successful, navigating to home");
      navigate('/');
    } catch (err: any) {
      console.error("Registration error:", err);
      
      // Handle specific Firebase errors with more user-friendly messages
      if (err.message.includes('auth/configuration-not-found')) {
        setError('Firebase authentication is not properly configured. Please check your Firebase console settings and ensure Authentication is enabled.');
      } else if (err.message.includes('auth/email-already-in-use')) {
        setError('This email is already registered. Please use a different email or try logging in.');
      } else if (err.message.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (err.message.includes('auth/weak-password')) {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError(err.message || 'Failed to create an account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Create an Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !firebaseInitialized}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        {!firebaseInitialized && (
          <div className="info-message">
            Initializing Firebase authentication... If this takes too long, please refresh the page.
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;

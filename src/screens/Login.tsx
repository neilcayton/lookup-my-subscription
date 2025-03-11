import React, { useState, useEffect } from 'react';
import { login } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    
    setLoading(true);

    try {
      console.log("Attempting to login with email:", email);
      await login(email, password);
      console.log("Login successful, navigating to home");
      navigate('/');
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle specific Firebase errors with more user-friendly messages
      if (err.message.includes('auth/configuration-not-found')) {
        setError('Firebase authentication is not properly configured. Please check your Firebase console settings and ensure Authentication is enabled.');
      } else if (err.message.includes('auth/user-not-found')) {
        setError('No account found with this email. Please check your email or register a new account.');
      } else if (err.message.includes('auth/wrong-password')) {
        setError('Incorrect password. Please try again.');
      } else if (err.message.includes('auth/invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (err.message.includes('auth/too-many-requests')) {
        setError('Too many failed login attempts. Please try again later or reset your password.');
      } else {
        setError(err.message || 'Failed to log in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Login to Your Account</h1>
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
          <button 
            type="submit" 
            disabled={loading || !firebaseInitialized} 
            className="auth-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
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

export default Login;

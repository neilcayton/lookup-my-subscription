import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import '../../styles/Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="app-title" onClick={() => navigate('/')}>Subscription Tracker</h1>
        <div className="header-actions">
          <button className="header-button" onClick={() => navigate('/add')}>Add New</button>
          <button className="header-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
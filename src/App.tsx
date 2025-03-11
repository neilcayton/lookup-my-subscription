import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import AddEditScreen from './screens/AddEditScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import Login from './screens/Login';
import Register from './screens/Register';
import { useAuthState } from './services/authService';
import { QueryProvider } from './context/QueryProvider';

function App() {
  const currentUser = useAuthState();
  
  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <QueryProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            } />
            <Route path="/subscription/:id" element={
              <ProtectedRoute>
                <SubscriptionScreen />
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <AddEditScreen />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <AddEditScreen />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;

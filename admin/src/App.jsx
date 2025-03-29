import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateElectionPage from './pages/CreateElectionPage';
import DashboardPage from './pages/DashboardPage';
import ElectionDetailsPage from './pages/ElectionDetailsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Check if user is already authenticated in session storage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setShowModal(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowModal(false);
      sessionStorage.setItem('isAuthenticated', 'true');
    } else {
      setError('Incorrect password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Auth Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className={`bg-white rounded-lg p-8 max-w-md w-full shadow-2xl transform transition-transform ${shake ? 'animate-shake' : ''}`}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Authentication</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                    Enter Admin Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                    autoFocus
                  />
                  {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Only show the main app content if authenticated */}
        {isAuthenticated && (
          <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route
                  path="/create-election"
                  element={
                    <ProtectedRoute>
                      <CreateElectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/elections/:id"
                  element={
                    <ProtectedRoute>
                      <ElectionDetailsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

// Add the shake animation to your CSS
const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0% { transform: translateX(0); }
      20% { transform: translateX(-10px); }
      40% { transform: translateX(10px); }
      60% { transform: translateX(-10px); }
      80% { transform: translateX(10px); }
      100% { transform: translateX(0); }
    }
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);
};

// Inject the styles when the component mounts
if (typeof window !== 'undefined') {
  injectGlobalStyles();
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateElectionPage from './pages/CreateElectionPage';
import DashboardPage from './pages/DashboardPage';
import ElectionDetailsPage from './pages/ElectionDetailsPage';

function App() {
  return (
    <Router>
      <div>
        <nav className="bg-indigo-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Voting System Admin</h1>
            <div className="space-x-4">
              <Link
                to="/"
                className="hover:bg-indigo-700 px-3 py-2 rounded"
              >
                Dashboard
              </Link>
              <Link
                to="/create-election"
                className="hover:bg-indigo-700 px-3 py-2 rounded"
              >
                Create Election
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create-election" element={<CreateElectionPage />} />
          <Route path="/elections/:id" element={<ElectionDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
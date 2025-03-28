import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateElectionPage from './pages/CreateElectionPage';
import DashboardPage from './pages/DashboardPage';
import ElectionDetailsPage from './pages/ElectionDetailsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/create-election" element={<CreateElectionPage />} />
            <Route path="/elections/:id" element={<ElectionDetailsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
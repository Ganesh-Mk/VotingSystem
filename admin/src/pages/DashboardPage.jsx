import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchElections } from '../services/api';
import UpdateElectionModal from '../components/UpdateElectionModal';
import DeleteElectionModal from '../components/DeleteElectionModal';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchData, setFetchData] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchElections();
        setElections(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch elections:', error);
        setLoading(false);
      }
    };

    loadElections();
  }, [fetchData]);

  const handleUpdateClick = (election) => {
    setSelectedElection(election);
    setFetchData(prev => !prev);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (election) => {
    setSelectedElection(election);
    setFetchData(prev => !prev);
    setDeleteModalOpen(true);
  };

  const handleElectionClick = (electionId) => {
    navigate(`/elections/${electionId}`);
  };

  const handleUpdateSuccess = (updatedElection) => {
    setElections(prevElections =>
      prevElections.map(election =>
        election._id === updatedElection._id ? updatedElection : election
      )
    );
    setFetchData(prev => !prev);
    setUpdateModalOpen(false);
  };

  const handleDeleteSuccess = (deletedElectionId) => {
    setElections(prevElections =>
      prevElections.filter(election => election._id !== deletedElectionId)
    );
    setFetchData(prev => !prev);
    setDeleteModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Election Dashboard</h1>

      {elections.length === 0 ? (
        <div className="text-center text-gray-500">
          No elections found. Create your first election!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <div
              key={election._id}
              className="bg-white shadow-md rounded-lg overflow-hidden relative cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleElectionClick(election._id)}
            >
              {election.image && (
                <img
                  src={election.image}
                  alt={election.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{election.title}</h2>
                <p className="text-gray-600 mb-2 truncate">{election.description}</p>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{election.location}</span>
                  <span>
                    {new Date(election.startDate).toLocaleDateString()} -
                    {new Date(election.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Candidates:</h3>
                  {election.candidates && election.candidates.length > 0 ? (
                    <ul className="space-y-1 truncate">
                      {election.candidates.slice(0, 3).map((candidate, index) => (
                        <li
                          key={candidate._id || `candidate-${index}`}
                          className="flex items-center space-x-2"
                        >
                          {candidate.logo && (
                            <img
                              src={candidate.logo}
                              alt={candidate.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <span>
                            {candidate.name || 'N/A'} {candidate.partyName ? `- ${candidate.partyName}` : ''}
                          </span>
                        </li>
                      ))}
                      {election.candidates.length > 3 && (
                        <li className="text-gray-500 text-sm">
                          +{election.candidates.length - 3} more
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No candidates</p>
                  )}
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateClick(election);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(election);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Election Modal */}
      {selectedElection && updateModalOpen && (
        <UpdateElectionModal
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          election={selectedElection}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Election Modal */}
      {selectedElection && deleteModalOpen && (
        <DeleteElectionModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          election={selectedElection}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default DashboardPage;
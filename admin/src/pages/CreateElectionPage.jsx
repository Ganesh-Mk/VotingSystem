import React, { useState } from 'react';
import CandidateForm from '../components/CandidateForm';
import { createElection } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateElectionPage = () => {
  const [electionDetails, setElectionDetails] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    image: null
  });
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  const handleElectionDetailsChange = (e) => {
    const { name, value } = e.target;
    setElectionDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setElectionDetails(prev => ({
          ...prev,
          image: reader.result
        }));
      };
    }
  };

  const handleAddCandidate = (candidate) => {
    setCandidates(prev => [...prev, candidate]);
  };

  const handleRemoveCandidate = (index) => {
    setCandidates(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!electionDetails.title || !electionDetails.location ||
      !electionDetails.startDate || !electionDetails.endDate) {
      alert('Please fill in all required election details');
      return;
    }

    if (candidates.length === 0) {
      alert('Please add at least one candidate');
      return;
    }

    try {
      const completeElectionData = {
        ...electionDetails,
        candidates
      };

      const response = await createElection(completeElectionData);
      console.log('Election created successfully:', response);

      // Reset form
      setElectionDetails({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        image: null
      });
      setCandidates([]);
      navigate('/');
    } catch (error) {
      console.error('Error creating election:', error);
      alert('Failed to create election');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Election</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Election Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">Election Title *</label>
            <input
              type="text"
              name="title"
              value={electionDetails.title}
              onChange={handleElectionDetailsChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description"
              value={electionDetails.description}
              onChange={handleElectionDetailsChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location *</label>
            <input
              type="text"
              name="location"
              value={electionDetails.location}
              onChange={handleElectionDetailsChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={electionDetails.startDate}
                onChange={handleElectionDetailsChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={electionDetails.endDate}
                onChange={handleElectionDetailsChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Election Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-violet-100"
            />
          </div>
        </form>

        {/* Candidate Form */}
        <div>
          <CandidateForm onAddCandidate={handleAddCandidate} />

          {/* Candidate List */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Added Candidates</h2>
            {candidates.length === 0 ? (
              <p className="text-gray-500">No candidates added yet</p>
            ) : (
              <ul className="space-y-2">
                {candidates.map((candidate, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                  >
                    <span>{candidate.name} - {candidate.partyName}</span>
                    <button
                      onClick={() => handleRemoveCandidate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Create Election
        </button>
      </div>
    </div>
  );
};

export default CreateElectionPage;
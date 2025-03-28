import React, { useState, useEffect } from 'react';
import { updateElection } from '../services/api';

const UpdateElectionModal = ({
  isOpen,
  onClose,
  election,
  onUpdateSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    image: '',
    candidates: []
  });

  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (election) {
      setFormData({
        title: election.title || '',
        description: election.description || '',
        location: election.location || '',
        startDate: election.startDate ? new Date(election.startDate).toISOString().split('T')[0] : '',
        endDate: election.endDate ? new Date(election.endDate).toISOString().split('T')[0] : '',
        image: election.image || '',
        candidates: election.candidates || []
      });

      setCandidates(election.candidates.map(candidate => ({
        name: candidate.name,
        partyName: candidate.partyName,
        logo: candidate.logo
      })));
    }
  }, [election]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index][field] = value;
    setCandidates(updatedCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', partyName: '', logo: '' }]);
  };

  const removeCandidate = (index) => {
    const updatedCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(updatedCandidates);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        candidates: candidates.map(candidate => ({
          // Preserve existing ID if available
          ...(candidate._id && { _id: candidate._id }),
          name: candidate.name,
          partyName: candidate.partyName,
          logo: candidate.logo
        }))
      };

      const response = await updateElection(election._id, payload);
      onUpdateSuccess(response.election);
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Update Election</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Candidates</h3>
              <button
                type="button"
                onClick={addCandidate}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Candidate
              </button>
            </div>
            {candidates.map((candidate, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  placeholder="Candidate Name"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                  className="px-2 py-1 border rounded-md"
                  required
                />
                <input
                  placeholder="Party Name"
                  value={candidate.partyName}
                  onChange={(e) => handleCandidateChange(index, 'partyName', e.target.value)}
                  className="px-2 py-1 border rounded-md"
                  required
                />
                <div className="flex items-center">
                  <input
                    placeholder="Logo URL"
                    value={candidate.logo}
                    onChange={(e) => handleCandidateChange(index, 'logo', e.target.value)}
                    className="px-2 py-1 border rounded-md flex-grow mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeCandidate(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update Election
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateElectionModal;
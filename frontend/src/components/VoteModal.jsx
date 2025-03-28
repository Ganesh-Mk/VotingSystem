import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { submitVote } from '../services/api.js';

export default function VoteModal({ candidate, electionId, isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [voterId, setVoterId] = useState('');
  const [errors, setErrors] = useState({});

  const voterIdInputRef = useRef(null);

  useEffect(() => {
    // Pre-fill name and email from localStorage when modal opens
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    setName(userName || '');
    setEmail(userEmail || '');

    // Reset voter ID and errors when modal opens
    setVoterId('');
    setErrors({});
  }, [isOpen]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const validateVoteData = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!voterId.trim()) {
      newErrors.voterId = 'Voter ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVoteSubmit = async () => {
    // Validate vote data
    if (!validateVoteData()) {
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const submitData = {
        electionId,
        candidateId: candidate._id,
        userId,
        name,
        email,
        voterId
      };

      await submitVote(submitData);

      // Update local storage to mark that user has voted
      localStorage.setItem('user.votedElection', electionId);
      localStorage.setItem('user.votedCandidate', candidate._id);

      alert('Vote submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to submit vote', error);
      alert(error.response?.data?.message || 'Failed to submit vote');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Confirm Your Vote
        </h2>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            You are voting for <span className="font-semibold">{candidate.name}</span>
          </p>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleInputChange(setName)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Enter your name"
              readOnly
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Enter your email"
              readOnly
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="voterId" className="block text-sm font-medium text-gray-700 mb-2">
              Voter ID
            </label>
            <input
              ref={voterIdInputRef}
              type="text"
              id="voterId"
              name="voterId"
              value={voterId}
              onChange={handleInputChange(setVoterId)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                ${errors.voterId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              placeholder="Enter your Voter ID"
            />
            {errors.voterId && <p className="text-red-500 text-xs mt-1">{errors.voterId}</p>}
          </div>
        </div>

        <button
          onClick={handleVoteSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}
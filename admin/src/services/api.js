import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Create Election (existing function)
export const createElection = async (electionData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/create-election`, electionData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

// Fetch All Elections (existing function)
export const fetchElections = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/all-election`);
    return response.data;
  } catch (error) {
    console.error('Error fetching elections:', error);
    throw error;
  }
};

// Fetch Single Election by ID
export const fetchElectionById = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/election/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching election details:', error);
    throw error;
  }
};

// Update Election
export const updateElection = async (id, electionData) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/update-election/${id}`, electionData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating election:', error);
    throw error;
  }
};

// Delete Election
export const deleteElection = async (id) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/delete-election/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting election:', error);
    throw error;
  }
};
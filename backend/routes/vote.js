
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Election = require('../models/election');
const Candidate = require('../models/candidate');

router.post('/vote', async (req, res) => {
  try {
    const { electionId, candidateId, userId, voterId } = req.body;

    // Validate input
    if (!electionId || !candidateId || !userId || !voterId) {
      return res.status(400).json({ message: 'Missing required vote information' });
    }

    // Check if user has already voted in this election
    const user = await User.findById(userId);
    if (user.votedElection) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Validate voter ID (you might want to add more robust validation)
    if (voterId.length < 5) {
      return res.status(400).json({ message: 'Invalid Voter ID' });
    }

    // Find the election and candidate
    const election = await Election.findById(electionId);
    const candidate = await Candidate.findById(candidateId);

    if (!election || !candidate) {
      return res.status(404).json({ message: 'Election or Candidate not found' });
    }

    // Increment candidate votes
    candidate.votesCount = (candidate.votesCount || 0) + 1;
    await candidate.save();

    // Update user to mark as voted
    user.votedElection = electionId;
    user.votedCandidate = candidateId;
    await user.save();

    res.status(200).json({
      message: 'Vote submitted successfully',
      votesCount: candidate.votesCount
    });

  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ message: 'Error submitting vote', error: error.message });
  }
});

module.exports = router;

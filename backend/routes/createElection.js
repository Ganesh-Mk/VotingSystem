const express = require('express');
const router = express.Router();
const Election = require('../models/election');
const Candidate = require('../models/candidate');

// Create a new election with candidates
router.post('/create-election', async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      image,
      candidates
    } = req.body;

    // Create candidates first
    const createdCandidates = await Candidate.create(candidates);

    // Create election with candidate references
    const election = new Election({
      title,
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      image,
      candidates: createdCandidates.map(candidate => candidate._id)
    });

    await election.save();

    res.status(201).json({
      message: 'Election created successfully',
      election,
      candidates: createdCandidates
    });
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({
      message: 'Failed to create election',
      error: error.message
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Election = require('../models/election');
const Candidate = require('../models/candidate');

router.put('/update-election/:id', async (req, res) => {
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

    // Find existing election
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Upsert candidates (update or insert)
    const candidatePromises = candidates.map(async (candidateData) => {
      if (candidateData._id) {
        // Update existing candidate
        return await Candidate.findByIdAndUpdate(
          candidateData._id,
          {
            name: candidateData.name,
            logo: candidateData.logo,
            partyName: candidateData.partyName
          },
          { new: true }
        );
      } else {
        // Create new candidate
        return await Candidate.create({
          name: candidateData.name,
          logo: candidateData.logo,
          partyName: candidateData.partyName
        });
      }
    });

    // Resolve all candidate operations
    const createdCandidates = await Promise.all(candidatePromises);

    // Update election with new candidate IDs
    election.title = title;
    election.description = description;
    election.location = location;
    election.startDate = new Date(startDate);
    election.endDate = new Date(endDate);
    election.image = image;
    election.candidates = createdCandidates.map(candidate => candidate._id);

    await election.save();

    res.status(200).json({
      message: 'Election updated successfully',
      election,
      candidates: createdCandidates
    });
  } catch (error) {
    console.error('Error updating election:', error);
    res.status(500).json({
      message: 'Failed to update election',
      error: error.message
    });
  }
});

module.exports = router;
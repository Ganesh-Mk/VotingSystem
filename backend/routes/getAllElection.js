const express = require('express');
const router = express.Router();
const Election = require('../models/election');

router.get('/all-election', async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('candidates')
      .sort({ startDate: -1 });

    res.status(200).json(elections);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({
      message: 'Failed to fetch elections',
      error: error.message
    });
  }
});

module.exports = router;
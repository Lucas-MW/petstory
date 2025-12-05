const express = require('express');
const router = express.Router();
const DailyHistory = require('../models/Dailyhistory');

//GET visit history for a specific pet
router.get('/pet/:petId', async (req, res) => {
  try {
    const historyRecords = await DailyHistory.find({ 
      petId: req.params.petId 
    })
    .sort({ checkOutTime: -1 })
    .limit(3);  // Limit to last 3 records

    res.json(historyRecords);z
  } catch (error) {
    console.error('Error fetching history for pet:', error);
    res.status(500).json({ error: 'Server error fetching pet history' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newHistory = new DailyHistory(req.body);
    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (error) {
    console.error('Error creating history record:', error);
    res.status(500).json({ error: 'Server error creating history record' });
  }
});

module.exports = router;
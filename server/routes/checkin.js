const express = require('express');
const router = express.Router();
const CheckIn = require('../models/Checkin');

//POST /api/check-in ( minimal , from check-in details)
router.post('/', async (req, res) => {
  console.log('=== CheckIn POST Request ===');
  console.log('Body:', req.body);
  try {
    const { petId, customerId, petName, phoneNumber, customerName, imageKey, totalPrice, services } = req.body;

    console.log('Extracted:', { petId, customerId, petName, customerName, phoneNumber, imageKey, totalPrice , services});

    if (!petId || !customerId || !petName || !phoneNumber || !customerName) {
      return res.status(400).json({ error: 'customerId, petId, petName, customerName, and customerPhone are required' });
    }
    const newCheckIn = new CheckIn({
      petId,
      customerId,
      petName,
      phoneNumber,
      customerName,
      services: services || [],
      paymentMethod: null,
      imageKey: imageKey || 'default',
      totalPrice: totalPrice || 0,
      tipPrice: 0,
      additionalCharges: 0,
      checkInTime: new Date(),
      status: 'in-progress'
    });

    const savedCheckIn = await newCheckIn.save();
    res.status(201).json(savedCheckIn);
  } catch (error) {
    console.error('Check-in creation error:', error);
    res.status(500).json({ error: 'Server error during check-in creation' });
  }
});

// GET get all check ins
router.get('/', async (req, res) => {
  try {
    const checkIns = await CheckIn.find({status: 'in-progress'})
      .populate('petId', 'imageKey type')
      .sort({ checkInTime: -1 });
    
    // Transform the data to include the pet's imageKey and type
    const transformedCheckIns = checkIns.map(checkIn => ({
      ...checkIn.toObject(),
      imageKey: checkIn.petId?.imageKey || checkIn.imageKey || 'default',
      petType: checkIn.petId?.type
    }));
    
    console.log(`Found ${transformedCheckIns.length} active in-progress check-ins`);
    res.json(transformedCheckIns);
  } catch (error) {
    console.error('get all Check-ins error:', error);
    res.status(500).json({ error: 'Server error during fetching all check-ins' });
  }
});

// GET get todays check in 
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /check-in/:id called with', req.params.id);
    const checkIn = await CheckIn.findById(req.params.id); 
    if (!checkIn) {
      return res.status(404).json({ error: 'check-in not found' });
    }
    res.json(checkIn);
  } catch (error) {
    console.error('get Check-in error:', error);
    res.status(500).json({ error: 'Server error during check-in' });
  }
});

//PATCH update check-in fields
router.patch('/:id', async (req, res) => {
  try {
    const {totalPrice, tipPrice, services, paymentMethod} = req.body;
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({ error: 'check-in not found' });
    }

    if (totalPrice !== undefined) checkIn.totalPrice = totalPrice;
    if (tipPrice !== undefined) checkIn.tipPrice = tipPrice;
    if (services !== undefined) checkIn.services = services;
    if (paymentMethod !== undefined) checkIn.paymentMethod = paymentMethod;

    const updatedCheckIn = await checkIn.save();
    res.json(updatedCheckIn);
  } catch (error) {
    console.error('Check-in update error:', error);
    res.status(500).json({ error: 'Server error during check-in update' });
  }
});

// delete check-in (cancelations)

router.delete('/:id', async (req, res) => {
  try {
    const checkIn = await CheckIn.findByIdAndDelete(req.params.id);

    if (!checkIn) {
      return res.status(404).json({ error: 'check-in not found' });
    }
    res.json({ message: 'Check-in deleted successfully' });
  } catch (error) {
    console.error('Check-in deletion error:', error);
    res.status(500).json({ error: 'Server error during check-in deletion' });
  }
});

module.exports = router;
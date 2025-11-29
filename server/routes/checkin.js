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

// GET get todays check in 

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
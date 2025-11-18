const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

//GET /api/customers/search?query=
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'search query is required' });
    }

    const cleanedQuery = query.replace(/\s+/g, '').toLowerCase();

  const customers = await Customer.find({
    $or: [
      { phoneNumber: { $regex: cleanedQuery, $options: 'i' } },
      { "pets.petName": { $regex: cleanedQuery, $options: 'i' } }
    ]
  });

  const results = [];
  customers.forEach(customer => {
    customer.pets.forEach(pet => {
      const petName = pet.petName.replace(/\s+/g, '').toLowerCase();
      const phoneNumber = customer.phoneNumber.replace(/\s+/g, '').toLowerCase();

      if (petName.includes(cleanedQuery) || phoneNumber.includes(cleanedQuery)) {
        results.push({
          id: pet._id,
          name: pet.petName,
          type: pet.type,
          imageKey: pet.imageKey,
          phoneNumber: customer.phoneNumber,
          customerId: customer._id,
          customerName: customer.customerName,
          customerAddress: customer.address
        });
      }
    } );
  });

  res.json(results);
} catch (error) {
    console.error('search error:', error);
    res.status(500).json({ error: 'server error during search' });
  }
});

//POST /api/customers - create new customer with pet
router.post('/', async (req, res) => {
  try {
    const { customerName, phoneNumber, address, petType, petName} = req.body;

    //Validation
    if (!customerName || !phoneNumber || !petType || !petName || !address) {
      return res.status(400).json({ error: 'missing required fields' });
    }

    if (!['Dog', 'Cat'].includes(petType)) {
      return res.status(400).json({ error: 'invalid pet type' });
    }

    const existingCustomer = await Customer.findOne({phoneNumber});

    if (existingCustomer) {
      //Add pet to existing customer
      existingCustomer.pets.push({petName, type: petType, imageKey: 'default'});
      await existingCustomer.save();
      return res.status(200).json(
        { message: 'added pet to existing customer', customer: existingCustomer }
      );
    }

    //Create new customer
    const newCustomer = new Customer({
      customerName,
      phoneNumber,
      address,
      pets: [{ petName, type: petType, imageKey: 'default' }]
    });
    await newCustomer.save();
    res.status(201).json(
      { message: 'added new customer with pet', customer: newCustomer }
    );
  } catch (error) {
    console.error('create customer error:', error);
    res.status(500).json({ error: 'server error during customer creation' });
  }
});

// GET /api/customers - Get all customers (do we need this?)

module.exports = router;
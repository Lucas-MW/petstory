const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Pet = require('../models/Pet');
const { normalizePhone } = require('../utils/phone');

//GET /api/customers/search?query=
router.get('/search', async (req, res) => {
  try {
    const { query, type } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }
    
    const searchTerm = query.trim();
    const searchRegex = new RegExp(searchTerm, 'i');
    
    // Build pet search filter
    const petFilter = { name: searchRegex };
    if (type) {
      petFilter.type = type.toLowerCase();
    }
    
    // Search pets and populate owner
    const pets = await Pet.find(petFilter)
      .populate('ownerId')
      .limit(20);
    
    // Also search customers by phone
    const phoneSearch = searchTerm.replace(/\D/g, '');
    let customersByPhone = [];
    if (phoneSearch.length >= 3) {
      customersByPhone = await Customer.find({
        phone: { $regex: phoneSearch }
      });
    }
    
    // Combine results
    const results = [];
    const seenPetIds = new Set();
    
    // Add pets from pet name search
    for (const pet of pets) {
      if (!pet.ownerId) continue;
      seenPetIds.add(pet._id.toString());
      
      results.push({
        petId: pet._id.toString(),
        petName: pet.name,
        type: pet.type,
        imageKey: pet.imageKey,
        phoneNumber: pet.ownerId.phone,
        customerId: pet.ownerId._id.toString(),
        customerName: pet.ownerId.name,
        customerAddress: pet.ownerId.address
      });
    }
    
    // Add pets from phone search
    for (const customer of customersByPhone) {
      const customerPets = await Pet.find({ ownerId: customer._id });
      
      for (const pet of customerPets) {
        // Skip if already added from pet name search
        if (seenPetIds.has(pet._id.toString())) continue;
        
        // Skip if type filter doesn't match
        if (type && pet.type.toLowerCase() !== type.toLowerCase()) continue;
        
        results.push({
          petId: pet._id.toString(),
          petName: pet.name,
          type: pet.type,
          imageKey: pet.imageKey,
          phoneNumber: customer.phone,
          customerId: customer._id.toString(),
          customerName: customer.name,
          customerAddress: customer.address
        });
      }
    }
    
    res.json(results);
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

//GET /api/customers/:id - get customer by id
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'customer not found' });
    }

    const pets = await Pet.find({ ownerId: customer._id });

    res.json({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      pets: pets
    });
    

  } catch (error) {
    console.error('get customer error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'server error during get customer' });
  }
});

//POST /api/customers - create new customer with pet
router.post('/', async (req, res) => {
  try {
    const { customerName, phoneNumber, address, petType, petName} = req.body;

    //Validation
    if (!customerName || !phoneNumber || !petType || !petName || !address) {
      return res.status(400).json({  error: 'VALIDATION_ERROR',
        message: 'Missing required fields' });
    }

    if (!['dog', 'cat'].includes(petType.toLowerCase())) {
      return res.status(400).json({ error: 'INVALID_PET_TYPE', message: 'Invalid pet type' });
    }
    
    const normalizedPhoneNumber = normalizePhone(phoneNumber);

    if (normalizedPhoneNumber.length > 10) {
      return res.status(400).json({ error: 'INVALID_PHONE_NUMBER', message: 'Phone number must be 10 digits' });
    }

    //Check for existing customer by phone
    const existingCustomer = await Customer.findOne({phone: normalizedPhoneNumber});

    if (existingCustomer) {
      //Add pet to existing customer
      const existingPet = await Pet.findOne({
        ownerId: existingCustomer._id,
        name: petName.trim()
      })

      if (existingPet) {
        return res.status(409).json({
          error: 'DIDUPLICATE_PET',
          message: 'pet already registered',
          existingPet,
          existingCustomer
        });
      }

      // customer exist but pet is new
      return res.status(409).json({
        error: 'DUPLICATE_PHONE',
        message: 'customer already registered',
        existingCustomer
      });
    }

    //Create new customer
    const customer = new Customer({
      name: customerName.trim(),
      phone: normalizedPhoneNumber,
      address: address.trim(),
    });
    await customer.save();

    //Create new pet
    const pet = new Pet({
      ownerId: customer._id,
      name: petName.trim(),
      type: petType.toLowerCase(),
    });
    await pet.save();


    res.status(201).json({customer,pet});
  } catch (error) {
    console.error('create customer error:', error);

    if (error.code === 11000) {
      return res.status(409).json({ error: 'DUPLICATE_PHONE', message: 'phone number already registered' });
    }
    res.status(500).json({ error: 'SERVER_ERROR', message: 'server error during customer creation' });
  }
});
  
// POST /api/customers/:customerId/pets - Add pet to existing customer
router.post('/:customerId/pets', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { petName, petType } = req.body;
    
    if (!petName || !petType) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Pet name and type are required'
      });
    }
    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Customer not found'
      });
    }
    
    // Check for duplicate pet name
    const existingPet = await Pet.findOne({
      ownerId: customerId,
      name: petName.trim()
    });
    
    if (existingPet) {
      return res.status(409).json({
        error: 'DUPLICATE_PET',
        message: 'Customer already has a pet with this name',
        existingPet
      });
    }
    
    const pet = new Pet({
      name: petName.trim(),
      type: petType.toLowerCase(),
      ownerId: customerId
    });
    
    await pet.save();
    
    res.status(201).json({ pet, customer });
    
  } catch (error) {
    console.error('Add pet error:', error);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Failed to add pet'
    });
  }
});

module.exports = router;
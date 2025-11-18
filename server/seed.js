require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');

const seedData = [
  {
    customerName: 'John Smith',
    phoneNumber: '(714) 788-7688',
    address: '123 Main St, La Mirada, CA',
    customerPets: [
      { petName: 'Bella', type: 'dog', imageKey: '13' }
    ]
  },
  {
    customerName: 'Sarah Johnson',
    phoneNumber: '(213) 123-4567',
    address: '456 Oak Ave, Los Angeles, CA',
    customerPets: [
      { petName: 'Max', type: 'dog', imageKey: '14' }
    ]
  },
  {
    customerName: 'Kim Park',
    phoneNumber: '(616) 773-1234',
    address: '789 Pine Rd, Fullerton, CA',
    customerPets: [
      { petName: '바위', type: 'cat', imageKey: 'bawi' }
    ]
  },
  {
    customerName: 'Mike Davis',
    phoneNumber: '(626) 666-6666',
    address: '321 Elm St, Pasadena, CA',
    customerPets: [
      { petName: 'Brisket', type: 'dog', imageKey: '14' }
    ]
  },
  {
    customerName: 'Lisa Chen',
    phoneNumber: '(714) 444-4444',
    address: '654 Maple Dr, Anaheim, CA',
    customerPets: [
      { petName: 'Bella', type: 'cat', imageKey: 'c1' }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-grooming');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Customer.deleteMany({});
    console.log('🗑️  Cleared existing customers');

    // Insert seed data
    await Customer.insertMany(seedData);
    console.log('✅ Seeded database with test customers');

    const count = await Customer.countDocuments();
    console.log(`📊 Total customers in database: ${count}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
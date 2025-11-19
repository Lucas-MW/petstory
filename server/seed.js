require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petstory');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
  // await Customer.deleteMany({});
  // console.log('🗑️  Cleared existing customers');

    const count = await Customer.countDocuments();
    console.log(`📊 Total customers in database: ${count}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
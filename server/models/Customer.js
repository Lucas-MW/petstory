const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  petName: { type: String, required: true , trim: true },
  type: { type: String, enum: ['Dog', 'Cat'], required: true },
  imageKey: { type: String , default: 'default'}
},{_id:true});

const CustomerSchema = new mongoose.Schema({
  customerName: { type: String, required: true , trim: true },
  phoneNumber: { type: String, required: true , trim: true },
  address: { type: String, required: true , trim: true},
  pets: [petSchema]
},{ timestamps: true });

CustomerSchema.index({phoneNumber:1 , "pets.petName":1});

module.exports = mongoose.model('Customer', CustomerSchema);
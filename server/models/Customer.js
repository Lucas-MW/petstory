const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: 
  { type: String, required: true , trim: true },
  phone: 
  { type: String, required: true , trim: true , unique: true,},
  address: 
  { type: String, required: true , trim: true},
},{ timestamps: true });

//CustomerSchema.index({phone: 1}, { unique: true });  we have unique constraint in phone field

module.exports = mongoose.model('Customer', CustomerSchema);
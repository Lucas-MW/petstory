const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer.pets', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  petName: { type: String, required: true },
  imageKey: { type: String , default: 'default'},
  phoneNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  totalPrice: { type: Number, default: 0 },
  tipPrice: { type: Number, default: 0 },
  additionalCharges: { type: Number, default: 0 },
  services: { type: String, enum: ['bath','groom','full','nail', 'other'] },
  paymentMethod: { type: String, enum: ['cash','card','zelle','venmo','applepay','other'] },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date }
}, { timestamps: true });

const CheckIn = mongoose.model('CheckIn', CheckInSchema);
module.exports = CheckIn;
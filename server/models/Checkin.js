const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  petName: { type: String, required: true },
  imageKey: { type: String, default: 'default'},
  phoneNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  totalPrice: { type: Number, default: 0 },
  tipPrice: { type: Number, default: 0 },
  additionalCharges: { type: Number, default: 0 },
  services: { 
    type: [String], 
    enum: ['Full Package', 'Bath', 'Grooming', 'Nail Trim']  // 앱과 동일하게
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'zelle', 'venmo', 'other'] 
  },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  status: { type: String, default: 'in-progress' }
}, { timestamps: true });

const CheckIn = mongoose.model('CheckIn', CheckInSchema);
module.exports = CheckIn;
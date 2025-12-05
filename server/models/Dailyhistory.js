const mongoose = require('mongoose');

const DailyHistorySchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer.pets', required: true },
  petName: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  services: [{ type: String }],
  baseprice: { type: Number, default: 0 },
  tip: { type: Number, default: 0 },
  additionalCharges: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash','card','zelle','venmo','other'] },
  totalPrice: { type: Number, default: 0 },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { type: String, default: 'completed' }
}, { timestamps: true });

const DailyHistory = mongoose.model('DailyHistory', DailyHistorySchema);
module.exports = DailyHistory;
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true , trim: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['dog', 'cat'], required: true },
  imageKey: { type: String , default: 'default'}
},{timestamps: true});

petSchema.index({ownerId: 1, name: 1},{ unique: true });

module.exports = mongoose.model('Pet', petSchema);
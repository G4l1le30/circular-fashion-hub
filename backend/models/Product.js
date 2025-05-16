const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['pre-loved', 'vintage', 'upcycled'] },
  material: { type: String, enum: ['organic_cotton', 'recycled_polyester'] },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema);
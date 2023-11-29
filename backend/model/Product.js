const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String, // Use the String schema type for names
  description: String,
  price: Number,
  category: String,
  image: String, // You can store the image file path as a string
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

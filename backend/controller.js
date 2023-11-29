const Product = require('./model/Product');
const User = require('./model/User');
const Order = require('./model/Order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config'); // Assuming the configuration file is in the same directory

const addProduct = async (req, res) => {

  const { name, description, price, category } = req.body;
  const image = req.file.filename;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
};

// controllers/productController.js


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password using bcrypt before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async(req, res) =>{
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and sign a JSON Web Token (JWT)
    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, config.jwtSecret, {
      expiresIn:'1h',
    });

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const createOrder = async (req, res) => {
  try {
    // Extract order data from the request body
    const { user, products, shippingInfo, total } = req.body;

    // Create a new order document
    const newOrder = new Order({
      user,
      products,
      shippingInfo,
      total,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with the saved order data
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }


}


const getOrders = async (req, res) => {
  // Retrieve the user's ID from the JWT token (you need to implement this part)
  
  const userId = req.user; 
  console.log(userId);// You'll need to set up authentication middleware for this
console.log(userId)
  try {
    const orders = await Order.find()
    .populate('products.product', ['name', 'price', 'description', 'image']).sort({ orderDate: -1 });
   

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
const getAdminOrders = async (req, res) => {
  // Retrieve the user's ID from the JWT token (you need to implement this part)
 // You'll need to set up authentication middleware for this 
  try {
    // Find orders for the specific user
    const orders = await Order.find().populate('products.product',['name', 'price', 'description','image']).sort({ orderDate: -1 });; // Populate the product details

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const newStatus = req.body.status;

    // Perform the update in your MongoDB database
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Use Mongoose to find and remove the product by ID
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


module.exports = {
  addProduct,
  getAllProducts,
  registerUser,
  loginUser,
  createOrder,
  getOrders,
  getAdminOrders,
  updateOrderStatus,
  deleteProduct
};

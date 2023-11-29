const express = require('express');
const multer = require('multer');
const path = require('path');
const {v4: uuidv4}=require('uuid');
const router = express.Router();
const controllers = require('./controller'); // Import the addProduct function from the controller
const middleware = require('./middleware/Authmiddleware')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // Create an 'uploads' directory to store uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}_${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Define the "add product" route
router.post('/api/saveproducts', upload.single('image'),controllers.addProduct);
router.get('/api/getproducts', controllers.getAllProducts);
router.post('/api/register', controllers.registerUser);
router.post('/api/login', controllers.loginUser);
router.post('/api/createorder', controllers.createOrder);
router.get('/api/orders',middleware.verifyToken, controllers.getOrders);
router.get('/api/adminorders', controllers.getAdminOrders);
router.put('/api/adminorders/:id', controllers.updateOrderStatus);
router.delete('/api/deleteproduct/:id', controllers.deleteProduct);

module.exports = router;

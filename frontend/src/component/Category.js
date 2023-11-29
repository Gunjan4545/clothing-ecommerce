import React, { useState, useEffect } from 'react';
import './style/Home.css';
// import products from './data';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Category() {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getproducts')
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  const [selectedImage, setSelectedImage] = useState(null);
 


  const openImagePopup = (imageURL) => {
    setSelectedImage(`http://localhost:5000/uploads/${imageURL}`);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    address: '',
    contact: '',
  });
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    contact: '',
  });

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value,
    });
  };

  function decodeJwtToken(tokenn) {
    try {
      const base64Url = tokenn.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  useEffect(() => {
    const storedShippingDetails = localStorage.getItem("shippingDetails");
  
    if (storedShippingDetails) {
      // If shipping details are found in local storage, parse the JSON data and set the state
      const parsedDetails = JSON.parse(storedShippingDetails);
      setShippingDetails(parsedDetails);
    }
  }, []);
  useEffect(() => {
    // Validate the form, ensuring all fields are filled
    const isValid = Object.values(shippingDetails).every((value) => value.trim() !== '');
    setIsFormValid(isValid);
  }, [shippingDetails]);

  const handleCheckout = () => {
    if (isFormValid) {
      localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));
    } else {
      // Handle validation errors and set error messages for unfilled fields
      const validationErrors = {};
      for (const [field, value] of Object.entries(shippingDetails)) {
        if (value.trim() === '') {
          validationErrors[field] = `${field} is required`;
        }
      }
      setErrors(validationErrors);
    }
    const jwtToken = localStorage.getItem('token');
    console.log('JWT Token:', jwtToken);
    if (jwtToken) {
      const decodedToken = decodeJwtToken(jwtToken);
      console.log('Decoded Token:', decodedToken);
      if (decodedToken) {
        const userId = decodedToken._id; // The 'sub' claim typically represents the user ID
        console.log('User ID:', userId);

        // Prepare the order data to send to the server, including the user's ID
        const orderData = {
          user: userId, // Use the 'userId' obtained from the JWT token
          products: cart.map(product => ({
            product: product._id, // Set this to the product's _id
            quantity: product.quantity, // Set this to the product's quantity in the cart
          })),
          shippingInfo: shippingDetails,
          // subtotal: calculateTotalPrice(),
          total: totalPrice,
        };
        console.log('Order Data:', orderData);
        // Make an HTTP POST request to your server to store the order
        axios
          .post('http://localhost:5000/api/createorder', orderData) // Replace with the actual API endpoint
          .then((res) => {
            // console.log('Order created:', res.data);
            // setCart([]);
            // localStorage.removeItem('cart');
            if (res.status === 201) {
              console.log('Order created:', res.data);
              setCart([]);
              localStorage.removeItem('cart');
              // Display an alert to the user
              window.alert('Order placed successfully!');
              history.push ("/orders")
            } else {
              // Handle the case where the order creation was not successful
              window.alert('Order placement failed. Please try again.');
            }
            // history.push ("/orders")
            // alert("order placed succesfuly")
          })
          .catch((err) => {
            console.error('Error creating order:', err);
            
          });
      } else {
        console.error('Invalid JWT token');
      }
    } else {
      console.error('JWT token not found in local storage');
      history.push("/login")
    }
  };

  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] = useState(false);
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item._id === product._id);
  
    if (existingProduct) {
      // Product already exists in the cart, update its quantity
      const updatedCart = cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      // Product doesn't exist in the cart, add it
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  
    // Update the local storage with the updated cart
    const updatedCart = existingProduct
      ? cart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  useEffect(() => {
    // Retrieve cart data from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // ... rest of your code
  }, []);


  const removeFromCart = (product) => {
    const existingProduct = cart.find(item => item._id === product._id);

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        const updatedCart = cart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        const updatedCart = cart.filter(item => item._id !== product._id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };
  // Calculate the total price
const totalPrice = calculateTotalPrice();

// Add the total price to local storage
localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
console.log('Total Price:', totalPrice);


  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div>
      <Navbar cartCount={cart.length} toggleCart={toggleCart} />
      <div>
        {showCart ? (
          <div className="cart"><br /><br />
            <h2>Shopping Cart</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="cart-image" />
                      {product.name}
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeFromCart(product)}>-</button>
                      {product.quantity}
                      <button onClick={() => addToCart(product)}>+</button>
                    </td>
                    <td>${(product.price * product.quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeFromCart(product)}> <FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div id='rs'>
              <p>Total Price: </p>
              <h1>${calculateTotalPrice().toFixed(2)}</h1>
              <button onClick={clearCart}>Clear Cart</button>
              <div id='shipping-details'>
                <h2>Shipping Details</h2>
                <form>
                <div className="form-group">
            <label htmlFor="name" className="label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={shippingDetails.name}
              onChange={handleShippingInfoChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address" className="label">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingDetails.address}
              onChange={handleShippingInfoChange}
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="contact" className="label">
              Contact No:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={shippingDetails.contact}
              onChange={handleShippingInfoChange}
            />
            {errors.contact && <div className="error-message">{errors.contact}</div>}
          </div>
</form>

              </div>
              <button onClick={handleCheckout}>Checkout</button>
            </div>

          </div>
        ) : (
          <div className='category'>
            <div className='category-buttons'>
              <button onClick={() => setSelectedCategory('All')}>All</button>
              <button onClick={() => setSelectedCategory('Men')}>Men</button>
              <button onClick={() => setSelectedCategory('Women')}>Women</button>
              <button onClick={() => setSelectedCategory('Kids')}>Kids</button>
            </div>
            <div className="menu">
              {filteredProducts.map(product => (
                <div className="item" key={product._id}>
                  <div onClick={() => openImagePopup(product.image)}>
                    <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="pizza-image" />
                    <span className="price">${product.price}</span>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>



                  </div>
                  <button onClick={() => addToCart(product)}>Add to cart</button>
                </div>
              ))}
            </div>
            {selectedImage && (
              <div className="larger-image">
                <span className="close-button" onClick={closeImagePopup}>
                  &times;
                </span>
                <img src={selectedImage} alt="Large" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;

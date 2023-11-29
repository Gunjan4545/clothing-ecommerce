import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../style/Home.css';
import axios from 'axios';

function Productlist() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getproducts')
        .then((res) => {
          console.log(res.data);
          setProducts(res.data);
        })
        .catch((err)=> console.log(err));
},[]);
const deleteProduct = (productId) => {
  // Send a DELETE request to your API to delete the product by ID
  axios
    .delete(`http://localhost:5000/api/deleteproduct/${productId}`)
    .then((res) => {
      // Handle the success case, e.g., remove the deleted product from the state
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
    })
    .catch((err) => console.log(err));
};

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div>
      <Navbar />
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
              <div>
                <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="pizza-image" />
                <span className="price">${product.price}</span>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
              <button>Edit</button>  
              <button onClick={() => deleteProduct(product._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Productlist;

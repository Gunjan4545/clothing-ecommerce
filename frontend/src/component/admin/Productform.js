import React, { useState } from 'react';
import Navbar from './Navbar';
import '../style/Products.css';
import axios from "axios";

function Productform() {
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Men', // Default category
    image: null,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({
      ...product,
      image: file,
    });
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('image', product.image);

    axios
    .post("http://localhost:5000/api/saveproducts", formData)
    .then((res)=> {
      setSuccessMessage('Product added successfully');
    })
    .catch((err)=> console.log(err));
  };


  return (
    <>
    <Navbar />
    <br />
    <br />
    <br />
    <div className='product-form'>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h1>Add Product</h1>
      <div className='label'>
      <label htmlFor="">Name:</label>
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleChange}
      /></div>
       <div className='label'>
      <label htmlFor="">Description:</label>
      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
      /></div>
       <div className='label'>
      <label htmlFor="">Price:</label>
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Product Price"
      /></div>
      <div className='label'>
      <label htmlFor="">Category:</label>
      <select
        name="category"
        value={product.category}
        onChange={handleChange}
        placeholder="Product Category"
      >
        <option value="">Select Category</option>
        <option value="Women">Women</option>
        <option value="Men">Men</option>
        <option value="Kids">Kids</option>
      </select>
      </div>
      <div className='label'>
      <label htmlFor="">Image:</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
      />
      {imagePreview && (
            <div className="image-preview2">
              <p>Selected Image</p>
              <img src={imagePreview} alt="Preview" width={100}/>
            </div>
          )}
      </div>
      <button type="submit">Add Product</button>
    </form>
    {successMessage && (
          <div className='success-message'>
            <p>{successMessage}</p>
          </div>
        )}
    </div>
         <div className='edit-btn'><button type="submit">Add Product</button></div> 
    </>
  );
}

export default Productform;

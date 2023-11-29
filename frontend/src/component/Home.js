import React from 'react'
import './style/Home.css';
import Navbar from './Navbar';

function Home() {
 
  return (

    <>
      <Navbar />
      <div className="homepage">
        <div className='bg'>
            <h1>Fasion Fusion</h1>
            <p>Best look any time anywhere ....</p>
            <a href='/category'>Start Your Order</a>
            </div>
      </div>
    </>
  )
}

export default Home
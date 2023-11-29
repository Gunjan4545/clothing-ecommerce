import React, { useState } from 'react';
import './style/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import {Link,useHistory} from 'react-router-dom';

function Navbar({ cartCount, toggleCart }) {
  const isAuthenticated = localStorage.getItem('token');
const History = useHistory();
  const handleLogout = () => {
    // Perform logout actions (clear session or token)
    localStorage.removeItem('token');
    History.push('/')
    
  };

  const [iscart, setIscart] = useState(false);
  
  const togglebutton = () => {
    setIscart((prevState) => !prevState);
  };

  return (
    <div className="navbar fixed-navbar"> {/* Add the "fixed-navbar" class */}
      <div className="left">
        <Link to="/">Fasion Fusion</Link>
      </div>
      <div className="right">
        <Link to="/">Home</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/category">
        <div className="navbar-buttons">
        <button onClick={toggleCart} >
        <button onClick={togglebutton}>
        {iscart ? <div className='text'>Category</div> : <span>
            <FontAwesomeIcon icon={faCartShopping} style={{ color: "#ffffff" }} />
            {cartCount > 0 && (
              <sup className="cart-count">{cartCount}</sup>
            )}
          </span> }
          </button>
        </button>
        </div>
        </Link>
        <div className="navbar-buttons">
        {isAuthenticated ? (
          // If the user is authenticated, show the Logout button
          <button onClick={handleLogout}>Logout</button>
        ) : (
          // If the user is not authenticated, show the Login button
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
      </div>
    </div>
  );
}

export default Navbar;

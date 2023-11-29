import React from 'react';
import '../style/Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link,useHistory} from 'react-router-dom';
function Navbar() {
  const isAuthenticated = localStorage.getItem('token');
  const History = useHistory();
    const handleLogout = () => {
      // Perform logout actions (clear session or token)
      localStorage.removeItem('token');
      History.push('/')
      
    };
  return (
    <div className="navbar fixed-navbar"> {/* Add the "fixed-navbar" class */}
    <div className="right">
       <Link to="/admin/addproduct">Add Products</Link>
       <Link to="/admin/Adminorders">Orders</Link>
       <Link to="/admin/productlist">Products</Link>
       <Link to="/about"> </Link>
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

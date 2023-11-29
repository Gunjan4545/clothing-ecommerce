// App.js
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'; // Use Route and Switch
import Home from './component/Home';
import Category from './component/Category';
import ProductForm from './component/admin/Productform';
import Orders from './component/Orders';
import Adminorders from './component/admin/Adminorders';
import Productlist from './component/admin/Productlist';
import Login from './component/Login';
import Register from './component/Register';


function App() {

  // Define a function to check if the user is authenticated
function isAdmin() {

  const authToken = localStorage.getItem('token');
  const authRole = localStorage.getItem('role')
   // Get the authentication token from local storage
  console.log('authToken:', authToken);
  console.log('authRole:', authRole);
 
  if (authToken && authRole==='admin') {

      return true;
  }
  

  return false; // Return false if not authenticated
}

function isUser() {

  const authToken = localStorage.getItem('token');
  const authRole = localStorage.getItem('role')
   // Get the authentication token from local storage
  console.log('authToken:', authToken);
  console.log('authRole:', authRole);
 
  if (authToken && authRole==='user') {

      return true;
  }
  

  return false; // Return false if not authenticated
}

function AdminRoute({ component: Component, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) =>
              isAdmin() ? (
                  <Component {...props} />
              ) : (
                <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
              )
          }
      />
  );
}

function UserRoute({ component: Component, ...rest }) {
  return (
      <Route
          {...rest}
          render={(props) =>
              isUser() ? (
                  <Component {...props} />
              ) : (
                <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
              )
          }
      />
  );
}
  return (
    <BrowserRouter>
      <div>
        <Switch> {/* Use Switch instead of Routes */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route exact path="/" component={Home} />
          <AdminRoute path="/admin/addproduct" component={ProductForm} />
          <Route path="/category" component={Category} />
          <UserRoute path="/orders" component={Orders} />
          {/* <UserRoute path="/checkout" component={Checkout} /> */}
          <AdminRoute path="/admin/adminorders" component={Adminorders} />
          <AdminRoute path="/admin/productlist" component={Productlist} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

const jwt = require('jsonwebtoken');
// const config = require('./config'); // Configuration file for secret key and other settings
const config = require('../config');

function authToken(req, res, next) {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the authorization header

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract the token from the "Authorization" header by splitting it
  const token = authHeader.split(' ')[1];
  
  // The token is the second part after splitting

  jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
    if (err) {
      console.log('JWT Verification Error:', err);
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Log the entire decoded token for debugging
    console.log('Decoded Token:', decodedToken);

    // Access the user ID from the decoded token (e.g., assuming 'sub' is the user ID property)
    const userId = decodedToken._id;
    console.log(userId);

    // Attach the user ID to the request object for use in subsequent route handlers
    req.user = userId;
    console.log('User Data Attached to req.user:', req.user);

    next();
  });
};

module.exports = {
  authToken,
  verifyToken
};
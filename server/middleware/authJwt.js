// server/middleware/authJwt.js
const jwt = require('jsonwebtoken');

exports.authJwt = async (req, res, next) => {
  const token = req.header('x-access-token');
  
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
};
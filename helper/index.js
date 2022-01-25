require('dotenv').config();
const jwt = require('jsonwebtoken');

const help = module.exports;

help.checkValidEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

help.checkValidPhone = (phone) => {
  const re = /^\d{10}$/;
  return re.test(phone);
};

help.generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_PRIVATE_KEY);
};

help.auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
};

const jwt = require("jsonwebtoken");

// Genrating a JWT token for an id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.KEY, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
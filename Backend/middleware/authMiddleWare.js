// Imports
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

// Middleware function
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers['authorization'] != undefined
  ) {
    try {
      // Splitting token  
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.decode(token, process.env.KEY);

      // Fetching user
      req.user = await User.findById(decoded.id).select("-password");

      // Calling next
      next();
    } catch (error) {
      // In case of error
      res.status(400).send("Token Authorization failed");
    }
  }

  // If token is not there
  if (!token) {
    res.status(400).send("No Token");
  }
}

// Exporting protect
module.exports = protect ;
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers['authorization'] != undefined
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.decode(token, process.env.KEY);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
}

module.exports = protect ;
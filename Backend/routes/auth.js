const express = require('express')
const { body, validationResult } = require("express-validator")
const dotenv = require("dotenv");
const User = require("../models/UserModel")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

const router = express.Router()

dotenv.config()
const JWT_SECRET = "ChatApp123";

// ROUTE 1: Creating a user
router.post("/createuser", [
    // Validating name, email and password
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Must be of 7 characters").isLength({ min: 7 }),
],
    async (req, res) => {
        let success = false;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {
            // Check whether the user with this email exist or not
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
            }

            // Hasing Password
            const salt = await bcrypt.genSalt(10);
            const secpass = await bcrypt.hash(req.body.password, salt)

            // Create a new user and save it in db
            user = await User.create({
                name: req.body.name,
                password: secpass,
                email: req.body.email,
                pic: req.body.pic
            })

            const data = {
                user: {
                    id: user.id
                }
            }

            // Signing JWT Key
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            // Sending authtoken in response
            res.json({ success, authtoken });
        } catch (e) {
            console.error(e.message);
            res.status(500).send("Internal Server Error"); // In case of errors
        }
    }
)

// ROUTE 2: Login By User
router.post("/login", [
    // Validating email and password
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring email and password from body
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        if (!user) {
            success = false;
            return res.status(400).json({ error: "ID not exist" })
        }
        const passcompare = await bcrypt.compare(password, user.password)

        if (!passcompare) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id,
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error"); // In case of errors
    }
}
)

module.exports = router
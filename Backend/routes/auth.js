const express = require('express')
const { body, validationResult } = require("express-validator")
const dotenv = require("dotenv");
const User = require("../models/UserModel")
const bcrypt = require('bcryptjs')
const OTP = require("../models/OTP")
const nodemailer = require("nodemailer");
const generateToken = require("../config/generateToken")

const router = express.Router()

dotenv.config()

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

            // Signing JWT Key
            const token = generateToken(user.id)
            success = true;
            // Sending authtoken in response
            const sendUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token
            }
            return res.json({ sendUser, success });
        } catch (e) {
            console.error(e.message);
            return res.status(500).send("Internal Server Error"); // In case of errors
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

        const token = generateToken(user.id)
        success = true;
        const sendUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token
        }
        return res.json({ sendUser, success });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error"); // In case of errors
    }
}
)

// Send email to user who forgot his password
router.post("/email-send", [
    // Validating email and password
    body("email", "Enter a valid email").isEmail(),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring email and password from body
    const { email } = req.body;

    try {
        let isUserExist = await User.findOne({ email });
        let previousOTP = await OTP.findOne({ email });


        if (!isUserExist) {
            return res.status(400).json({ success, error: "Sorry you are not registered to ChatoPedia" })
        }

        if (previousOTP) {
            await OTP.deleteOne({ email });
        }

        const randomNumber = Math.floor(Math.random() * 100000000);

        const otpSend = randomNumber.toString().substring(2, 8);

        // Hasing OTP
        const salt = await bcrypt.genSalt(10);

        const otpStore = new OTP({
            email,
            code: await bcrypt.hash(otpSend, salt),
            expiryTime: new Date().getTime() + 300 * 1000
        })

        await otpStore.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        });

        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: "One Time Password of Chat'Ster",
            text: `We think you have requested for reset password. Here's your OTP ${otpSend}.`
        };

        await transporter.sendMail(mailOptions);

        success = true;
        return res.status(200).json({ success, msg: "Please check your Email ID" })
    } catch (e) {
        return res.status(400).json({ success, error: "Internal Server Error Occured" })
    }
}
)

// Validating OTP
router.post("/validateOTP", [
    // Validating email and password
    body("email", "Enter a valid email").isEmail(),
], async (req, res) => {
    let currentTime = new Date().getTime();
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring email and password from body
    const { email, Obtainedotp } = req.body;

    try {
        const user = await OTP.findOne({ email });

        // Checking expiry time of OTP
        // let diff = currentTime - user.expiryTime
        // if (diff < 0) {
        //     return res.status(400).json({ success, msg: "OTP Expired" })
        // }

        const otpcompare = await bcrypt.compare(Obtainedotp, user.code)

        if (otpcompare) {
            success = true;
            return res.status(200).json({ success, msg: "Validated Successfully" })
        } else {
            return res.status(401).json({ success, msg: "Incorrect OTP" })
        }

    } catch (e) {
        return res.status(500).json({ success, error: "Internal Server Error Occured" })
    }
}
)

// Changing Password
router.post("/changePassword", [
    // Validating email and password
    body("email", "Enter a valid email").isEmail(),
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
        const user = await User.findOne({ email });

        // Hasing Password
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(password, salt)

        // Create a new document that contains the updated email address
        user.password = secpass;
        await user.save();

        success = true;
        return res.status(200).json({ success, msg: "Password Updated" })
    } catch (e) {
        return res.status(500).json({ success, error: "Internal Server Error Occured" })
    }
}
)

module.exports = router
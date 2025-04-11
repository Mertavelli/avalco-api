const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validator = require('validator');


// create new user controller
const createNewUserController = async (req, res) => {
    try {
        const {
            name,
            email,
            birthdate,
            phone,
            password,
            street,
            zipCode,
            residence,
        } = req.body;

        // password hash
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                }

                // Create New User
                const newUser = new User({
                    name,
                    email,
                    birthdate,
                    phone,
                    password: hash,
                    street,
                    zipCode,
                    residence,
                    balance: 500,
                });

                let user = await newUser.save();

                res.status(201).json(user);
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error occurred",
        });
    }
};


// login user controller
const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user available
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                error: {
                    email: "User not found! Please try again!!",
                },
            });
        }

        // check password correct or incorrect
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.status(500).json({
                    error: "Server Error Occurred!",
                });
            }

            if (!result) {
                return res.status(400).json({
                    error: {
                        password: "Email or Password Incorrect!",
                    },
                });
            }

            // prepare the user object to generate token
            const userObject = {
                _id: user._id,
                name: user.name,
                email: user.email,
                birthdate: user.birthdate,
                phone: user.phone,
                balance: user.balance,
            };

            // generate token
            const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRY,
            });

            res.status(200).json({
                user: userObject,
                token,
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error occurred!!",
        });
    }
};

// send Email-Code
const sendCodeController = async (req, res) => {
    const generatedCode = generateRandomCode();
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            // Die E-Mail-Adresse ist nicht gültig
            return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
        }

        const transporter = nodemailer.createTransport({
            service: "Gmail", // Anbieter (hier verwenden wir Gmail, Sie können einen anderen Anbieter verwenden)
            auth: {
                user: "louiskarakas.bw@gmail.com", // Ihre E-Mail-Adresse
                pass: "hjfg naof ihdo tyjj", // Ihr E-Mail-Passwort
            },
        });

        // E-Mail-Optionen
        const mailOptions = {
            from: "louiskarakas.bw@gmail.com", // Absenderadresse
            to: email, // Empfängeradresse
            subject: "Ihr Avalco-Verifizierungscode", // Betreff
            text: "Ihr Bestätigungscode: " + generatedCode, // Textinhalt der E-Mail
        };

        await transporter.sendMail(mailOptions);
        //console.log("E-Mail erfolgreich gesendet!");

        res.status(201).json({ data: generatedCode });

        //res.send({ data: generateRandomCode })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error occurred!!",
        });
    }
};

const checkEmailExistingController = async (req, res) => {
    try {
        const { email } = req?.body?.email || {};
        const existingEmailUser = await User.findOne({ email: email.toLowerCase() });

        res.status(200).json(existingEmailUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error occurred!!",
        });
    }
};

function generateRandomCode() {
    const min = 1000; // Mindestwert für eine 4-stellige Zahl
    const max = 9999; // Höchstwert für eine 4-stellige Zahl
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode;
}

module.exports = {
    createNewUserController,
    loginUserController,
    sendCodeController,
    checkEmailExistingController
};
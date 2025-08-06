const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const User = require('../Models/user.model.js')

const signUp = async (req, res) => {


    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const validEmail = emailValidator.validate(email);
        if (!validEmail) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        return res.status(500).json({ message: (error.message) });

    }
}
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || await bcrypt.compare(user.password, password)) {
            return res.status(400).json({ message: "Invalid Cridentals" });
        }
        const token = user.jwtToken();
        user.password = undefined; // Remove password from response
        const cookieoption = {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true
        };
        res.cookie('token', token, cookieoption);
        res.status(200).json({ sucess: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ message: (error.message) });

    }


}
const logOut = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



const getUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { signUp, signIn, logOut, getUser };
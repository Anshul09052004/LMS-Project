import emailValidator from 'email-validator'
import User from '../Models/user.model.js';
import bcrypt from 'bcryptjs';
import AppError from '../Utils/error.util.js';

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 1000, //
    httpOnly: true,
    secure: true // Prevents client-side JavaScript from accessing the cookie
}

const register = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;
        if (!fullName || !email || !password) {
            return next(AppError("All fields are required", 400));
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(AppError("User already exists", 400));
        }
        const user = await User.create({
            fullName, email, password, avtara: {
                public_id: "email",
                secure_url: "https://example.com/default-avatar.png"
            }
        });
        if (!user) {
            return next(AppError("User registration failed", 500));
        }
        //todo file upload
        await user.save();
        user.password = undefined; // Exclude password from response
        const token = await user.jwtToken();
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        return next(AppError(error.message, 500));
    }
}
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(AppError("All fields are required", 400));
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.comparePassword(password)) {
            return next(AppError("Invalid email or password", 401));
        }
        const token = await user.jwtToken();
        user.password = undefined; // Exclude password from response
        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
        });
    }
    catch (error) {
        return next(AppError(error.message, 500));

    }

}
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}



const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId)
        return res.status(200).json({
            success: true,
            user,
            message: "User profile fetched successfully"
        });

    }catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }

}


export { register, login, logout, getProfile };
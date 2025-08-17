
import User from '../Models/user.model.js';
import AppError from '../Utils/error.util.js';
import cloudinary from 'cloudinary';
import fs from 'fs';
import sendEmail from '../Utils/sendEmail.js';



const cookieOptions = {
    maxAge: 7 * 24 * 60 * 1000, //
    httpOnly: true,
    secure: true // Prevents client-side JavaScript from accessing the cookie
}

const register = async (req, res, next) => {

    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new AppError("User already exists", 400));
        }
        const user = await User.create({
            fullName, email, password, avatar: {
                public_id: "email",
                secure_url: "https://example.com/default-avatar.png"
            }
        });
        if (!user) {
            return next(new AppError("User registration failed", 500));
        }
        //todo file upload
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'uploads',
                    width: 250,
                    height: 250,
                    crop: 'fill',
                    gravity: 'face',
                    use_filename: true,
                    unique_filename: false,
                });

                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // Delete file from server after upload
                try {
                    fs.unlinkSync(req.file.path);
                    console.log("Local file deleted successfully");
                } catch (err) {
                    console.error("Failed to delete local file:", err);
                }

            } catch (error) {
                return next(new AppError("File upload failed", 500));
            }
        }
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
        return next(new AppError("Something went wrong", 400)); // ✅

    }
}
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(AppError("All fields are required", 400));
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(awaituser.comparePassword(password))) {
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
        return next(new AppError(error.message, 500));

    }

}
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    } catch(error){
        return next(new AppError(error.message, 500));

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

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }

}
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new AppError("Email is required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(AppError("User not found", 404));
    }
    const resetToken = user.generatePasswordResetToken();
    await user.save();
    const ResetPasswordUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const subject = "Password Reset Request";
    const message = `Click the link below to reset your password:
                     <a href="${ResetPasswordUrl}">${ResetPasswordUrl}</a>
                     <p>If you did not request this, please ignore this email.</p>`;

    try {
        await sendEmail(
            email,
            subject,
            message
        );
        res.status(200).json({
            success: true,
            message: `Password reset email sent to ${email} successfully`,
        });
    }
    catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save();
        return next(new AppError("Failed to send password reset email", 500));
    }


}
const resetPassword = async (req, res) => {

    const { resetToken } = req.params;
    const { password } = req.body
    const forgotPasswordExpiry = crypto
        .create('sha256')
        .update(resetToken)
        .digist('hex');
    const user = await User.findOne({
        forgotPasswordToken: resetToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    })
    if (!user) {
        return next(new AppError('token is invalid or expire please try again', 400))

    }
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    })
}
const changePassword = async (req,res,next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
        return next(new AppError("All fields are required", 400));

    }
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (!user.comparePassword(oldPassword)) {
        return next(new AppError("Old password is incorrect", 400));
    }
    user.password = newPassword;
    await user.save();
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })
}
const updateUser = async (req, res) => {
    const { fullName } = req.body
    const { id } = req.user.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    user.fullName = fullName;
    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'uploads',
                width: 250,
                height: 250,
                crop: 'fill',
                gravity: 'face',
                use_filename: true,
                unique_filename: false,
            });

            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;

            // Delete file from server after upload
            try {
                fs.unlinkSync(req.file.path);
                console.log("Local file deleted successfully");
            } catch (err) {
                console.error("Failed to delete local file:", err);
            }

        } catch (error) {
            return next(new AppError("File upload failed", 500));
        }

    }
    await user.save();
    res.status(200).json({
        success: true,
        message: "User updated successfully"
    })

}

export { register, login, logout, getProfile, forgotPassword, resetPassword, updateUser, changePassword };
import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';
import crypto from 'node:crypto';
import { subscribe } from 'node:diagnostics_channel';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxLength: [50, 'Full name cannot exceed 50 characters'],
        minlenght: [3, 'Full name must be at least 3 characters long'],
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false, // Exclude password from queries by default
    },
    avatar: {
        public_id: {
            type: String,
            required: false,
        },
        secure_url: {
            type: String,
        }

    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    subscription: {
        type: String,
        enum: ["free", "premium"], // optional, tumhare app ke hisab se
        default: "free"
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    }
}, {

    timestamps: true,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
}
)

userSchema.methods = {
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email, role: this.role, subscription: this.subscription }, // payload
            process.env.JWT_SECRET,              // secret key
            { expiresIn: process.env.JWT_EXPIRY } // options
        );
    },
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generatePasswordResetToken: async function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
        return
    }
};

const User = mongoose.model("User", userSchema);
export default User;
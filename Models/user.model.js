import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';
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
    avtar: {
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
            { id: this._id, email: this.email }, // payload
            process.env.JWT_SECRET,              // secret key
            { expiresIn: process.env.JWT_EXPIRY } // options
        );
    },
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    }
};

const User = mongoose.model("User", userSchema);
export default User;
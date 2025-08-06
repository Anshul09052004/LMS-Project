const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
        minlenght: 3
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
    },
},{
    timestamps: true,
})
userSchema.pre('save',async function(next)
    {
        if(!this.isModified('password')){
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
)

userSchema.methods={
    jwtToken(){
        return JWT.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
}


const User = mongoose.model("User", userSchema);
module.exports = User;
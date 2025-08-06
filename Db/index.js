const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected successfully ${mongoose.connection.host}`);

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}
module.exports = connectDb;
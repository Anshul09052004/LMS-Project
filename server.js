import app from './app.js';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

dotenv.config();
const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
})
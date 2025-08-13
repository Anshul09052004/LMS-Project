import express from 'express';
import connectDb from './Db/index.js';
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/userRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './Middlewares/error.middleware.js';
import coursesRoutes from './Routes/coursesRoutes.js';
const app=express();
connectDb();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(express.urlencoded({ extended: true }));
app.get('/home',(req,res)=>{
res.send("server running")
})

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', coursesRoutes);

app.use(errorMiddleware);


export default app;
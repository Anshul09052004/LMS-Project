const express = require('express');
const app=express();

const connectDb = require('./Db/index.js');
connectDb();
const authRoute = require('./Routes/authRoute.js');
app.use(express.json());
app



app.use('/api/auth/', authRoute);


module.exports = app;
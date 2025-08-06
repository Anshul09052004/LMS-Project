const express = require('express');
const { signUp,signIn, logOut, getUser } = require('../Controllers/authController.js');
const jwtAuth = require('../Middlewares/jwtAuth.js');
const authRoute = express.Router();

authRoute.post('/signUp', signUp);
authRoute.post('/signIn', signIn);
authRoute.post('/LogOut', logOut);
authRoute.get('/LogOut', jwtAuth,getUser);


module.exports = authRoute;

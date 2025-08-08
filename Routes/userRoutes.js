import { Router } from "express";
import { register, login, logout, getProfile } from "../Controllers/authController.js";
import isLoggedIn from "../Middlewares/auth.middleware.js";
const router = Router();
router.post('/register', register);
router.post('/login', login);   
router.get('/logout', logout);
router.get('/me', isLoggedIn, getProfile);

export default router;
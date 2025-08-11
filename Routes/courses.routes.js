import { Router } from "express";
import {getAllCourses,getLectureByCourseId} from '../Controllers/courses.controller.js';
import isLoggedIn from "../Middlewares/auth.middleware";
const router = Router();


router.get('/course',isLoggedIn,getAllCourses)
router.get('/:id', isLoggedIn,getLectureByCourseId)
export default router;
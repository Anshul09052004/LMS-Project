import { Router } from "express";
import { creatCourse, getAllCourse, getLectureByCourseId, removeCourse, updateCourse } from '../Controllers/courses.controller.js';
import { isLoggedIn} from "../Middlewares/auth.middleware.js";
import upload from "../Middlewares/multer.middleware.js";
import {authorizeRoles} from "../Middlewares/auth.middleware.js";
const router = Router();

router.route('/')
    .get( getAllCourse)
    .post(isLoggedIn,authorizeRoles("admin"),upload.single("thumbnail"), creatCourse)


router.route('/:id')
    .get(isLoggedIn,authorizeRoles("ADMIN"), getLectureByCourseId)
    .put(isLoggedIn,authorizeRoles("ADMIN"), updateCourse)
    .delete(isLoggedIn,authorizeRoles("ADMIN"), removeCourse)

export default router;
import cloudinary from "cloudinary";
import Course from "../Models/courses.model.js";
import AppError from '../Utils/error.util.js';
import fs from 'fs';
import { set } from "mongoose";

const creatCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy, thumbnail } = req.body;


        if (!title || !description || !category || !createdBy) {
            return next(new AppError("All fields are required", 400));
        }

        const course = await Course.create({
            title, description, category, createdBy, thumbnail: {
                public_id: "email",
                secure_url: "https://example.com/default-avatar.png"
            }
        });

        if (!course) {
            return next(new AppError("Courses not found", 404));
        }

        if (req.file) {

            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'uploads',
                    width: 250,
                    height: 250,
                    crop: 'fill',
                    use_filename: true,
                    unique_filename: false,
                });

                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;

                // Delete file from server after upload
                try {
                    fs.unlinkSync(req.file.path);
                    console.log("Local file deleted successfully");
                } catch (err) {
                    console.error("Failed to delete local file:", err);
                }

            } catch (error) {
                return next(new AppError("File upload failed", 500));
            }
        }

        await course.save();

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            course
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const getLectureByCourseId = async () => {
    const { id } = req.params;
    const courses = await findById(id);
    if (!courses) {
        return next(new AppError("courses not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: "courses fetched successfully",
        courses
    });
}
const updateCourse = async (req, res, next) => {

    try {
        const { id } = req.params;
        const course = await course.findByIdAndUpdate(
            id, {
            $set: req.body
        }, {
            runvalidators: true
        }
        );
        if (!course) {
            return next(new AppError("courses not found", 404));
        }
        return res.status(200).json({
            success: true,
            message: "courses updated successfully",
            course
        });

    } catch (error) {
        return next(new AppError(error.message, 500));

    }
}

const removeCourse = (req, res, next) => {

    try {
        const { id } = req.params;
        const course = course.findByIdAndDelete(id);
        if (!course) {
            return next(new AppError("courses not found", 404));
        }
        return res.status(200).json({
            success: true,
            message: "courses deleted successfully",
            course
        });
    } catch (error) {
        return next(new AppError(error.message, 500));

    }
}
const getAllCourse = async (req, res, next) => {
    const courses = await Course.find({}).select(-'lectures');
    if (!courses) {
        return next(new AppError("courses not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: "courses fetched successfully",
        courses
    });

}

export {
    getLectureByCourseId, creatCourse, updateCourse, removeCourse, getAllCourse
}
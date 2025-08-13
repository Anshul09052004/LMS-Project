import { Schema, model } from "mongoose";
const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [50, "Title cannot exceed 50 characters"],
        minLength: [3, "Title must be at least 3 characters long"],
        trim: true,
    },
    createdBy: {
        type: String,
        required: [true, "Creator is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [500, "Description cannot exceed 500 characters"],
        minLength: [3, "Description must be at least 3 characters long"],
        trim: true,
    },
    thumbnail: {
        public_id: {
            type: String,
            required: [true, "Thumbnail is required"],
        
        },
        secure_url: {
            type: String,
            required: [true, "Thumbnail is required"],
        },
    },
    lectures: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        lecture: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    }],
    category: {
        type: String,
        required: [true, "Cataogary is required"],
        trim: true,
    },
    numberOfLectures: {
        type: Number,
        default: 0,
        required: [true, "Number of Lectures is required"],
        trim: true,
    }


},
    { timestamps: true }
);
export default model("Course", courseSchema);
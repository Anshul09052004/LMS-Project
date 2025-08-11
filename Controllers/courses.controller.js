const getAllCourses = async () => {

    try {
        const courses = await Course.find({}).select(-'lectures');

        if (!courses) {
            return next(new AppError("courses not found", 404));
        }
        return res.status(200).json({
            success: true,
            message: "courses fetched successfully",
            courses
        });
    } catch (error) {
        return next(new AppError(error.message, 500));

    }
}
const getLectureByCourseId=async()=>{
    const {id}=req.params;
    const courses =await findById(id);
    if (!courses) {
        return next(new AppError("courses not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: "courses fetched successfully",
        courses
    });
}
export  {
    getAllCourses, getLectureByCourseId
}
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'something went wrong';
   res.status(err.statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack:err.stack
   })
}
export default errorMiddleware;
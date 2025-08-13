import { token } from "morgan";
import AppError from "../Utils/error.util.js";
import jwt from "jsonwebtoken";


const isLoggedIn = async (req, res, next) => {
   if (!token) {
      return next(new AppError("unauthozized access please login first", 401));
   }

   const user = await jwt.verify(token, process.env.JWT_SECRET);
   req.user = userDetails;
   next();
}

const authorizeRoles = (...roles) => async (req, res, next) => {
   const currentUserRole = req.user.role;
   if (!roles.includes(currentUserRole)) {
      return next(new AppError("unauthozized access please login first", 401));
   }
   next();
}
export {
   isLoggedIn, authorizeRoles

}
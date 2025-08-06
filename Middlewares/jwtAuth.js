const JWT = require('jsonwebtoken');
const jwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user={id:payload.id,email:payload.email}; // Attach user info to request object
    
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
    next();
}

module.exports = jwtAuth;
const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  console.log("Inside jwtMiddleware");
  
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
       res.status(403).json({ message: "Authorization header missing" });
    }

    const token = authHeader.startsWith('Bearer') ? authHeader.slice(7) : authHeader;
    if (!token) {
       res.status(403).json({ message: "Token not found" });
    }

    const decodedToken = jwt.verify(token, process.env.jwtToken);
    req.payload = decodedToken.userId; // Assuming `userId` is part of the payload
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = jwtMiddleware;

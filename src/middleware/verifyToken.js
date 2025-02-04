const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // const token = req.headers.authorization?.split(' ')[1]; // Fixed typo: spilt -> split

        if (!token) {
            return res.status(401).send({ message: "No token provided" }); // Fixed capitalization
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) { // Improved validation
            return res.status(401).send({ message: "Invalid token payload" });
        }

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();

    } catch (error) {
        console.error("Error in verifyToken:", error.message); // Improved error logging
        return res.status(401).send({ message: "Invalid Token" }); // Added return to stop execution
    }
};

module.exports = verifyToken;

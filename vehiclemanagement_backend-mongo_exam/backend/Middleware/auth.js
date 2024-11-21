import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
    // Retrieve cookies from headers
    const cookies = req.headers.cookie;

    // Check if cookies exist
    if (!cookies) {
        return res.status(401).json({ message: "Authentication required: No cookies found" });
    }

    // Split the cookie string into individual cookies
    const cookieArray = cookies.split(';');

    let token;
    for (let cookie of cookieArray) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'authtoken') {
            token = value;
            break;
        }
    }

    // Check if token is found
    if (!token) {
        return res.status(401).json({ message: "Authentication required: Token not found" });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, secretKey);
        req.Username = verified.Username;
        req.UserRole = verified.Role;

        console.log('User authenticated:', verified);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export { authenticate };

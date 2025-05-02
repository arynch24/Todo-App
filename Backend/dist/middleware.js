import jwt from 'jsonwebtoken';
import cookie from 'cookie';
const authMiddleware = (req, res, next) => {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.userId;
        next();
    });
};
export default authMiddleware;

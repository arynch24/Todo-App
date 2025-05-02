
const jwt = require('jsonwebtoken');

const authMiddleware = (req:any, res:any, next:any) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err:any, decoded:any) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.userId = decoded.userId;
        next();
    });
}

module.exports = authMiddleware;
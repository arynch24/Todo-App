import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authMiddleware = (req: any, res: any, next: any) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET || "", (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    (async () => {
      try {
        req.userId = decoded.userId;
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        });

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        req.googleRefreshToken = user?.googleRefreshToken;
        next();
      } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    })();
  });
};

export default authMiddleware;

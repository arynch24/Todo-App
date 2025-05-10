import express from 'express';
import userRouter from './user.js';
import googleRouter from './google.js';

const router = express.Router();
router.use('/user', userRouter);
router.use('/google',googleRouter);
export default router;
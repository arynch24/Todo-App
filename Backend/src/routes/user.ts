import { PrismaClient } from "@prisma/client";

import authMiddleware from "../middleware.js";
import zod from "zod";
import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();
const client = new PrismaClient();

router.use(express.json());

const userSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post('/signup', async (req: any, res: any) => {
    const userDetails = req.body
    const { success, error } = userSchema.safeParse(userDetails);
    if (error) {
        res.status(400).json({
            message: 'Invalid user details',
            error: error.errors
        })
        return;
    }
    const existingUser = await client.user.findUnique({
        where: {
            username: userDetails.username
        }
    })
    if (existingUser) {
        res.status(400).json({
            message: 'User already exists'
        })
        return;
    }

    const user = await client.user.create({
        data: {
            username: userDetails.username,
            password: userDetails.password,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName
        }
    });

    const userId = user.id;
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign({ userId }, JWT_SECRET || "");
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7
    });

    res.status(200).json({
        message: 'User created successfully',
        token: token
    });
});

router.post('/signin', async (req: any, res: any) => {
    const userDetails = req.body
    const { success, error } = zod.object({
        username: zod.string(),
        password: zod.string()
    }).safeParse(userDetails);
    if (error) {
        res.status(400).json({
            message: 'Invalid user details',
            error: error.errors
        })
        return;
    }
    const existingUser = await client.user.findUnique({
        where: {
            username: userDetails.username,
            password: userDetails.password
        }
    })
    if (!existingUser) {
        res.status(400).json({
            message: 'User does not exist'
        })
        return;
    }

    if (existingUser.password !== userDetails.password) {
        res.status(400).json({
            message: 'Invalid password'
        })
        return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const userId = existingUser.id;

    const token = jwt.sign({ userId }, JWT_SECRET || "");
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    res.status(200).json({
        message: 'User signed in successfully',
        token: token
    });
});

router.get('/signout', (req: any, res: any) => {
    res.clearCookie('token');
    res.status(200).json({
        message: 'User signed out successfully'
    });
});

router.get('/todos', authMiddleware, async (req: any, res: any) => {
    const userId = req.userId;

    const todos = await client.todo.findMany({
        where: {
            userId: userId
        }
    });

    res.status(200).json({
        message: "Todos Fetched",
        todos: todos
    });
});

router.post('/createtodo', authMiddleware, async (req: any, res: any) => {
    const body = req.body;
    const { title, description, createdAt } = body;
    const userId = req.userId;
    if (!title || !description || !createdAt) {
        res.status(400).json({
            message: 'Invalid todo details'
        })
        return;
    }

    const parsedDate: Date = new Date(createdAt || Date.now());

    const todo = await client.todo.create({
        data: {
            userId,
            title,
            description,
            createdAt: parsedDate
        }
    });

    res.status(200).json({
        message: 'Todo created successfully',
        todo: todo
    });
});


export default router;

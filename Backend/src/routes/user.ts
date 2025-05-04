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
        samesite: 'lax',
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
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
        samesite: 'lax',
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
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
    let date = req.query.date || ""; 
    console.log("Received date:", date);

    if (!date) {
        return res.status(400).json({ message: "Date query parameter is required." });
    }

    const startDate = new Date(date);

    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(startDate.setHours(23, 59, 59, 999));

    console.log("Start of day:", startOfDay);
    console.log("End of day:", endOfDay);

    try {
        const todos = await client.todo.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: startOfDay,  
                    lte: endOfDay    
                }
            }
        });

        console.log("Fetched todos:", todos);

        res.status(200).json({
            message: "Todos fetched successfully",
            todos: todos
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Error fetching todos." });
    }
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

router.post('/updatetodo', authMiddleware, async (req: any, res: any) => {
    const { id, ...updates } = req.body;
    const userId = req.userId;

    if (!id) {
        return res.status(400).json({ message: 'Todo ID is required' });
    }

    try {
        const todo = await client.todo.update({
            where: { id, userId },
            data: updates,
        });

        res.status(200).json({ message: 'Todo updated successfully', todo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating todo' });
    }
});

router.post('/deletetodo', authMiddleware, async (req: any, res: any) => {
    const { id } = req.body;
    const userId = req.userId;

    if (!id) {
        return res.status(400).json({ message: 'Todo ID is required' });
    }

    try {
        await client.todo.delete({
            where: { id, userId },
        });

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting todo' });
    }
});


export default router;

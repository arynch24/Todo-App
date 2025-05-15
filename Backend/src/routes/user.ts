import { PrismaClient, Prisma } from "@prisma/client";

import authMiddleware from "../middleware.js";
import zod from "zod";
import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();
const client = new PrismaClient();

router.use(express.json());

const userSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post('/signup', async (req: any, res: any) => {
    const userDetails = req.body
    const { success, error } = userSchema.safeParse(userDetails);
    if (error) {
        res.status(401).json({
            message: 'Invalid Email',
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

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    userDetails.password = hashedPassword;

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
        sameSite: 'none',
        secure: true,
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
        username: zod.string().email(),
        password: zod.string()
    }).safeParse(userDetails);
    if (error) {
        res.status(400).json({
            message: 'Invalid Email or Password',
            error: error.errors
        })
        return;
    }
    const existingUserName = await client.user.findUnique({
        where: {
            username: userDetails.username
        }
    })
    if (!existingUserName) {
        res.status(400).json({
            message: 'User does not exist'
        })
        return;
    }

    // Compare the hashed password with the provided password
    const isPasswordValid = await bcrypt.compare(userDetails.password, existingUserName.password);
    if (!isPasswordValid) {
        res.status(400).json({
            message: 'Invalid password'
        })
        return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const userId = existingUserName.id;

    const token = jwt.sign({ userId }, JWT_SECRET || "");

    res.cookie('token', token, {
        sameSite: 'none',
        secure: true,
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
    });

    res.status(200).json({
        message: 'User signed in successfully',
        token: token
    });
});

router.get('/signout', (req: any, res: any) => {
    res.clearCookie('token', {
        secure: true,
        sameSite: 'None',
    });
    res.status(200).json({
        message: 'User signed out successfully'
    });
});

router.get('/info', authMiddleware, async (req: any, res: any) => {
    const userId = req.userId;

    try {
        const userInfo = await client.user.findUnique({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            userInfo: userInfo,
            message: "User Info Fetched Successfully"
        })
    }
    catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Error fetching todos." });
    }
})

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

    const data: Prisma.TodoUncheckedCreateInput = {
        userId,
        title,
        description,
        createdAt: new Date(createdAt)
    };

    const todo = await client.todo.create({ data });

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

router.get('/verify', authMiddleware, async (req: any, res: any) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({
            message: 'Unauthorized'
        })
        return;
    }

    const user = await client.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        res.status(401).json({
            message: 'Unauthorized'
        })
        return;
    }

    res.status(200).json({
        message: 'User verified successfully',
        user: user
    });
});


export default router;

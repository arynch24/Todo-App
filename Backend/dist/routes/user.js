var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = req.body;
    const { success, error } = userSchema.safeParse(userDetails);
    if (error) {
        res.status(400).json({
            message: 'Invalid user details',
            error: error.errors
        });
        return;
    }
    const existingUser = yield client.user.findUnique({
        where: {
            username: userDetails.username
        }
    });
    if (existingUser) {
        res.status(400).json({
            message: 'User already exists'
        });
        return;
    }
    const user = yield client.user.create({
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
        maxAge: 60 * 60 * 24 * 7
    });
    res.status(200).json({
        message: 'User created successfully',
        token: token
    });
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = req.body;
    const { success, error } = zod.object({
        username: zod.string(),
        password: zod.string()
    }).safeParse(userDetails);
    if (error) {
        res.status(400).json({
            message: 'Invalid user details',
            error: error.errors
        });
        return;
    }
    const existingUser = yield client.user.findUnique({
        where: {
            username: userDetails.username,
            password: userDetails.password
        }
    });
    if (!existingUser) {
        res.status(400).json({
            message: 'User does not exist'
        });
        return;
    }
    if (existingUser.password !== userDetails.password) {
        res.status(400).json({
            message: 'Invalid password'
        });
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
}));
router.get('/signout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: 'User signed out successfully'
    });
});
router.get('/todos', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const todos = yield client.todo.findMany({
        where: {
            userId: userId
        }
    });
    res.status(200).json({
        message: "Todos Fetched",
        todos: todos
    });
}));
router.post('/createtodo', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { title, description, createdAt } = body;
    const userId = req.userId;
    if (!title || !description || !createdAt) {
        res.status(400).json({
            message: 'Invalid todo details'
        });
        return;
    }
    const parsedDate = new Date(createdAt || Date.now());
    const todo = yield client.todo.create({
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
}));
router.post('/updatetodo', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { id } = _a, updates = __rest(_a, ["id"]);
    const userId = req.userId;
    if (!id) {
        return res.status(400).json({ message: 'Todo ID is required' });
    }
    try {
        const todo = yield client.todo.update({
            where: { id, userId },
            data: updates,
        });
        res.status(200).json({ message: 'Todo updated successfully', todo });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating todo' });
    }
}));
export default router;

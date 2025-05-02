var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
const authMiddleware = require('../middleware');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.router();
const client = new PrismaClient();
router.use(express.json());
const userSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastname: zod.string()
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
            lastName: userDetails.lastname
        }
    });
    const userId = user.id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7
    });
    res.status(200).json({
        message: 'User created successfully',
        token: token
    });
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const token = jwt.sign({ username: userDetails.username }, process.env.JWT_SECRET);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
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
    const { title, description } = body;
    const userId = req.userId;
    if (!title || !description) {
        res.status(400).json({
            message: 'Invalid todo details'
        });
        return;
    }
    const todo = yield client.todo.create({
        data: {
            userId,
            title,
            description
        }
    });
    res.status(200).json({
        message: 'Todo created successfully',
        todo: todo
    });
}));

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
const client = new PrismaClient();
function createUser(username, password, firstName, lastName) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield client.user.create({
            data: {
                username,
                password,
                firstName,
                lastName
            }
        });
        console.log(user);
    });
}
function createTodo(userId, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const todo = yield client.todo.create({
            data: {
                userId,
                title,
                description
            }
        });
        console.log(todo);
    });
}
function getTodos(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const todos = yield client.todo.findMany({
            where: {
                userId: userId
            }
        });
        console.log(todos);
    });
}
getTodos(1);
function getTodosAndUserDetails(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const todos = yield client.todo.findMany({
            where: {
                userId: userId
            },
            select: {
                user: true,
                title: true,
                description: true
            }
        });
        console.log(todos);
    });
}
getTodosAndUserDetails(1);
module.exports = {
    createUser,
    createTodo,
    getTodos,
    getTodosAndUserDetails
};

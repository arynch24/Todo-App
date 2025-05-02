import { PrismaClient } from "@prisma/client";
import { get } from "http";

const client = new PrismaClient();

async function createUser(username: string, password: string, firstName: string, lastName: string) {
    const user = await client.user.create({
        data: {
            username,
            password,
            firstName,
            lastName
        }
    });
    console.log(user);
}
// createUser("arynch24","jknnfsf242","Aryan","Chahan");

async function createTodo(userId: number, title: string, description: string) {
    const todo = await client.todo.create({
        data: {
            userId,
            title,
            description
        }
    });
    console.log(todo);
}
createTodo(1, "go to toilet", "go to gym and do 100 pushups");



async function getTodos(userId: number) {
    const todos = await client.todo.findMany({
        where: {
            userId: userId
        }
    });
    console.log(todos);
}
getTodos(1);

async function getTodosAndUserDetails(userId: number) {
    const todos = await client.todo.findMany({
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
}
getTodosAndUserDetails(1);

module.exports = {
    createUser,
    createTodo,
    getTodos,
    getTodosAndUserDetails
}
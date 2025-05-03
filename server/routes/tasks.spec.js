const router = require('./tasks');
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const task = require('../models/task');
const pg = require('pg');

jest.mock('../models/task');
jest.mock('jsonwebtoken');
jest.mock('pg');

class Client {
    constructor() {}
    connect(err) {
        throw err;
    }
}

describe('Tasks Route', () => {
    const app = express();
    app.use(express.json());
    app.use('/tasks', router);

    beforeEach(() => {
        task.getTasks = jest.fn();
        task.addTask = jest.fn();
        task.updateTask = jest.fn();
        task.deleteTask = jest.fn();
        jwt.verify = jest.fn();
        pg.Client = jest.fn();
        pg.Client.mockImplementation((config) => Client);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /tasks', () => {
        it('should return tasks', async () => {
            const tasks = [{ id: 1, title: 'Task 1' }];
            task.getTasks.mockImplementation((userId, callback) => {
                callback(null, tasks);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const res = await request(app).get('/tasks')

            expect(res.status).toBe(200);
            expect(res.body).toEqual(tasks);
        });

        it('should return error if getTasks fails', async () => {
            const error = new Error('Ошибка при получении задач');
            task.getTasks.mockImplementation((userId, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const res = await request(app).get('/tasks');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Ошибка при получении задач' });
        });

        it ('should return 401 if token is invalid', async () => {
            task.getTasks.mockImplementation((userId, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('Invalid token'), null));
            const res = await request(app).get('/tasks');

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: 'Сессия недействительна. Пожалуйста, войдите снова.' });
        });
    });

    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const taskData = { title: 'New Task', description: 'Это новая задача' };
            const newTask = { id: 2, title: 'New Task' };
            task.addTask.mockImplementation((title, description, userId, dueDate, callback) => {
                callback(null, newTask);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const req = { body: taskData };
            const res = await request(app).post('/tasks').send(req.body);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ task: newTask, message: 'Новая задача успешно добавлена' });
        });

        it('should return error if addTask fails', async () => {
            const taskData = { title: 'New Task', description: 'Это новая задача' };
            const error = new Error('Ошибка при добавлении задачи Новой задачи');
            task.addTask.mockImplementation((title, description, userId, dueDate, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const req = { body: taskData };
            const res = await request(app).post('/tasks').send(req.body);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Ошибка при добавлении задачи Новой задачи' });
        });

        it ('should return 401 if token is invalid', async () => {
            const taskData = { title: 'New Task', description: 'This is a new task' };
            task.addTask.mockImplementation((title, description, userId, dueDate, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('Invalid token'), null));
            const req = { body: taskData };
            const res = await request(app).post('/tasks').send(req.body);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: 'Сессия недействительна. Пожалуйста, войдите снова.' });
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update a task', async () => {
            const taskData = { status: 'completed' };
            const updatedTask = { id: 1, title: 'Task 1', status: 'completed' };
            task.updateTask.mockImplementation((status, taskId, userId, callback) => {
                callback(null, updatedTask);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const req = { body: taskData };
            const res = await request(app).put(`/tasks/${updatedTask.id}`).send(req.body);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ task: updatedTask, message: 'Task 1 updated successfully' });
        });

        it('should return error if updateTask fails', async () => {
            const taskId = 1;
            const taskData = { status: 'completed' };
            const error = new Error('Error in updating task');
            task.updateTask.mockImplementation((status, taskId, userId, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const req = { body: taskData };
            const res = await request(app).put(`/tasks/${taskId}`).send(req.body);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error in updating task' });
        });

        it ('should return 401 if token is invalid', async () => {
            const taskId = 1;
            const taskData = { status: 'completed' };
            task.updateTask.mockImplementation((status, taskId, userId, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('Invalid token'), null));
            const req = { body: taskData };
            const res = await request(app).put(`/tasks/${taskId}`).send(req.body);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: 'Session invalid. Please re-login.' });
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            const deletedTask = { id: 1, title: 'Task 1' };
            task.deleteTask.mockImplementation((taskId, userId, callback) => {
                callback(null, deletedTask);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const res = await request(app).delete(`/tasks/${deletedTask.id}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ task: deletedTask, message: 'Task 1 deleted successfully' });
        });

        it('should return error if deleteTask fails', async () => {
            const taskId = 1;
            const error = new Error('Error in deleting task');
            task.deleteTask.mockImplementation((taskId, userId, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 1, email: 'testuser@example.com' }));
            const res = await request(app).delete(`/tasks/${taskId}`);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error in deleting task' });
        });

        it ('should return 401 if token is invalid', async () => {
            const taskId = 1;
            task.deleteTask.mockImplementation((taskId, userId, callback) => {
                callback(error, null);
            });

            jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('Invalid token'), null));
            const res = await request(app).delete(`/tasks/${taskId}`);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: 'Сессия недействительна. Пожалуйста, войдите снова.' });
        });
    });
});

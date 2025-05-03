const router = require('./index');
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const pg = require('pg');

jest.mock('../models/user');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('pg');

class Client {
    constructor() {}
    connect(err) {
        throw err;
    }
}

describe('Маршрут Index', () => {
  const app = express();
  app.use(express.json());
  app.use('/', router);

  beforeEach(() => {
    user.getUser = jest.fn();
    user.addUser = jest.fn();
    jwt.sign = jest.fn();
    bcrypt.hash = jest.fn();
    bcrypt.compare = jest.fn();
    pg.Client = jest.fn();
    pg.Client.mockImplementation((config) => Client);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /login', () => {
    it('должен вернуть 400, если не хватает email или пароля', async () => {
      const res = await request(app).post('/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Отсутствуют обязательные параметры');
    });

    it('должен вернуть 400, если email или пароль неверны', async () => {
      user.getUser.mockImplementation((email, cb) => cb('Неверный адрес электронной почты или пароль.'));
      const res = await request(app).post('/login').send({ email: 'test@example.com', password: 'password' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Неверный адрес электронной почты или пароль.');
    });

    it('должен вернуть токен, если email и пароль верны', async () => {
      const userData = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      user.getUser.mockImplementation((email, cb) => cb(null, userData));
      bcrypt.compare.mockImplementation((password, hashPassword) => true);
      jwt.sign.mockImplementation((payload, secretOrPrivateKey, options, callback) => 'token');

      const res = await request(app).post('/login').send({ email: 'test@example.com', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBe('token');
      expect(res.body.name).toBe(userData.name);
      expect(res.body.message).toBe('Вход выполнен успешно!');
    });
  });

  describe('POST /register', () => {
    it('должен вернуть 400, если не хватает email, пароля или имени', async () => {
      const res = await request(app).post('/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Отсутствуют обязательные параметры');
    });

    it('должен вернуть 400, если пользователь уже существует', async () => {
      user.addUser.mockImplementation((name, email, password, cb) => cb('Пользователь уже существует'));
      const res = await request(app).post('/register').send({ email: 'test@example.com', password: 'password', name: 'John Doe' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Пользователь уже существует');
    });

    it('должен вернуть токен, если пользователь успешно создан', async () => {
      const userData = { id: 1, email: 'test@example.com', password: 'hashedPassword', name: 'John Doe' };
      user.addUser.mockImplementation((name, email, password, cb) => cb(null, userData));
      bcrypt.hash.mockImplementation((password, salts) => 'hashedPassword');
      jwt.sign.mockImplementation((payload, secretOrPrivateKey, options, callback) => 'token');

      const res = await request(app).post('/register').send({ email: 'test@example.com', password: 'password', name: 'John Doe' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBe('token');
      expect(res.body.name).toBe(userData.name);
      expect(res.body.message).toBe('Пользователь успешно создан!');
    });
  });
});

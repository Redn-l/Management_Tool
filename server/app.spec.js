const request = require('supertest');
const app = require('./app');
const pg = require('pg');

jest.mock('pg');

class Client {
    constructor() {}
    connect(err) {
        throw err;
    }
}

describe('GET /', () => {
  it('base route does not exist', async () => {
    pg.Client = jest.fn();
    pg.Client.mockImplementation((config) => Client);
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404);
  });
});
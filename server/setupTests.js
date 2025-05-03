
const express = require('express');
const app = require('./app');

const server = express();
server.use(express.json());
server.use(app);

let serverInstance;
beforeAll((done) => {
    serverInstance = server.listen(5001, () => {
    done();
  });
});

afterAll((done) => {
    serverInstance.close(done);
});

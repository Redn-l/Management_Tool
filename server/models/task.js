const client = require('../utils/dbConnector');

class Task {
    constructor() {}

    getTasks(userId, cb) {
        client.query("SELECT * FROM Tasks WHERE user_id = $1", [userId], (err, result) => {
            if (err) {
                cb(err, result);
            }
            cb(null, result.rows);
        });
    }

    addTask(title, description, userId, dueDate, cb) {
        client.query("INSERT INTO Tasks (title, description, user_id, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *", [title, description, userId, dueDate, 'todo'], (err, result) => {
            if (err) {
                cb(err, result);
            }
            cb(null, result.rows[0]);
        });
    }

    updateTask(newStatus, taskId, userId, cb) {
        client.query("UPDATE Tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [newStatus, taskId, userId], (err, result) => {
            if (err) {
                cb(err, result);
            }
            cb(null, result.rows[0]);
        });
    }

    deleteTask(taskId, userId, cb) {
        client.query("DELETE FROM Tasks WHERE id = $1 AND user_id = $2 RETURNING *", [taskId, userId], (err, result) => {
            if (err) {
                cb(err, result);
            }
            cb(null, result.rows[0]);
        });
    }
}

const task = new Task();
module.exports = task;

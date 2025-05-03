const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const task = require('../models/task');

router.get('/', isLoggedIn, async (req, res) => {
    task.getTasks(req.user?.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Ошибка при получении задач" });
        res.json(result);
    });
});

router.post('/', isLoggedIn, async (req, res) => {
    task.addTask(req.body.title, req.body.description, req.user?.id, req.body.dueDate, (err, result) => {
        if (err) return res.status(500).json({ message: `Ошибка при добавлении задачи "${req.body.title}"` });
        res.json({ task: result, message: `Задача "${result.title}" успешно добавлена` });
    });
});

router.put('/:id', isLoggedIn, async (req, res) => {
    task.updateTask(req.body.status, req.params.id, req.user?.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Ошибка при обновлении задачи" });
        res.json({ task: result, message: `Задача "${result.title}" успешно обновлена` });
    });
});

router.delete('/:id', isLoggedIn, async (req, res) => {
    task.deleteTask(req.params.id, req.user?.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Ошибка при удалении задачи" });
        res.json({ task: result, message: `Задача "${result.title}" успешно удалена` });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/jwtHelper');
const { getHashPassword, comparePasswords } = require('../utils/passwordHelper');
const user = require('../models/user');

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({message: 'Отсутствуют необходимые параметры'});
    
    user.getUser(email, async (err, userData) => {
        if (err || !userData) return res.status(400).json({message: "Неверный адрес электронной почты или пароль."});

        const validPassword = await comparePasswords(password, userData.password);
        if (!validPassword) return res.status(400).json({message: "Неверный адрес электронной почты или пароль."});

        const token = generateToken(userData);
        res.json({token, name: userData.name, message: "Авторизация прошла успешно!"});
    });
});

router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({message: 'Отсутствуют необходимые параметры'});
    const hashPassword = await getHashPassword(password);

    user.addUser(name, email, hashPassword, (err, userData) => {
        if (err) return res.status(400).send({ message: "Пользователь уже существует" });
        const token = generateToken(userData);
        return res.json({token, name, message: "Пользователь зарегестрирован успешно!"});
    });
});
  
module.exports = router;
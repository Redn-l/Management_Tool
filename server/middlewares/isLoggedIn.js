const { verifyToken } = require("../utils/jwtHelper");

module.exports = (req, res, next) => {
    const token = req.headers?.token;
    verifyToken(token, (err, decoded) => {
        if (err) return res.status(401).json({message: 'Сессия недействительна. Пожалуйста, повторно войдите в систему.'});

        req.user = decoded;
        next();
    });
};
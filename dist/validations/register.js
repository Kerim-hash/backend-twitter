"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidations = void 0;
var express_validator_1 = require("express-validator");
exports.registerValidations = [
    (0, express_validator_1.body)('email', 'Введите E-Mail').isEmail().withMessage('Неверный E-Mail').isLength({ min: 10, max: 50 }).withMessage('Неверная длина почты. Допустимое кол-во символов в почте от 10 до 50.'),
    (0, express_validator_1.body)('fullname', 'Введите имя').isString().isLength({ min: 2, max: 35 }).withMessage('Допустимое кол-во символов в имени от 2 до 35.'),
    (0, express_validator_1.body)('username', 'Укажите логин').isString().isLength({ min: 2, max: 35 }).withMessage('Допустимое кол-во символов в логине от 2 до 35.'),
    (0, express_validator_1.body)('password', 'Укажите пароль').isString().isLength({ min: 8, max: 30 }).withMessage('Пароль должен состоять не менее чем из 8 символов и не более 30 символов').custom(function (value, _a) {
        var req = _a.req;
        if (value !== req.body.password2) {
            throw new Error('Пароли не совподают');
        }
        else {
            return value;
        }
    }),
];

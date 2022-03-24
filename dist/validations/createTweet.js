"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTweetValidations = void 0;
var express_validator_1 = require("express-validator");
exports.createTweetValidations = [
    (0, express_validator_1.body)('text', 'Введите текст твита').isString().isLength({ max: 280 }).withMessage('Максимальная длина твита 280 символов'),
];

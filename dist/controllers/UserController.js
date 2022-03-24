"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCtrl = void 0;
var express_validator_1 = require("express-validator");
var generateHash_1 = require("../utils/generateHash");
var UserModel_1 = require("../models/UserModel");
var mailer_1 = __importDefault(require("../core/mailer"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var isValidObjectId_1 = require("../utils/isValidObjectId");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    // Request Get All User
    UserController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserModel_1.UserModel.find({}).exec()];
                    case 1:
                        users = _a.sent();
                        res.json({
                            status: 'success',
                            data: users
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            errors: err_1
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Request Get User By id
    UserController.prototype.show = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.params.id;
                        if (!(0, isValidObjectId_1.isValidObjectId)(userId)) {
                            res.status(400).send();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, UserModel_1.UserModel.findById(userId).populate('tweets').exec()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            res.status(400).send();
                            return [2 /*return*/];
                        }
                        else {
                            res.json({
                                status: 'success',
                                data: user
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            errors: err_2
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // sign Up
    UserController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, data_1, token, user, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            res.status(400).json({ status: 'error', errors: errors.array() });
                            return [2 /*return*/];
                        }
                        data_1 = {
                            email: req.body.email,
                            username: req.body.username,
                            fullname: req.body.fullname,
                            password: (0, generateHash_1.generateMD5)(req.body.password + process.env.SECKRET_KEY),
                            confirm_hash: (0, generateHash_1.generateMD5)(process.env.SECKRET_KEY || Math.random().toString())
                        };
                        token = jsonwebtoken_1.default.sign({ data: req.user }, process.env.SECKRET_KEY || '8D@UID@2d22erf', {
                            expiresIn: 604800,
                        });
                        return [4 /*yield*/, UserModel_1.UserModel.create(data_1)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, mailer_1.default.sendMail({
                                from: "admin@twitter.com",
                                to: data_1.email,
                                subject: "Подтверждение почты Twitter Tutorial",
                                html: "\u0414\u043B\u044F \u0442\u043E\u0433\u043E, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043F\u043E\u0447\u0442\u0443, \u043F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 <a href=\"http://localhost:8080/auth/verify?hash=".concat(data_1.confirm_hash, "\">\u043F\u043E \u044D\u0442\u043E\u0439 \u0441\u0441\u044B\u043B\u043A\u0435</a>"),
                            }, function (err, info) {
                                if (err) {
                                    res.status(500).json({
                                        status: 'error',
                                        message: err.message
                                    });
                                }
                                else {
                                    res.status(201).json({
                                        status: 'success',
                                        message: "Sucessfuly Created User",
                                        link: "http://localhost:8080/auth/verify?hash=".concat(data_1.confirm_hash)
                                    });
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            message: err_3.message
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // verify
    UserController.prototype.verify = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, user, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        hash = req.query.hash;
                        if (!hash) {
                            res.status(400).send();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, UserModel_1.UserModel.findOne({ confirm_hash: hash }).exec()];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            user.confirmed = true;
                            user.save();
                            res.send("<!DOCTYPE html>\n  <html>\n  <head>\n      <title>\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 Twitter!</title>\n      <meta charset=\"utf-8\" />\n  </head>\n  <style>\n  h1 {color:blue; text-align: center}\n  h3 {color:blue; text-align: center}\n  a {color: blue}\n</style>\n  <body>\n      <h1> \uD83C\uDF89\uD83C\uDF89\u0412\u0430\u0448 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 Twitter \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\uD83C\uDF89\uD83C\uDF89</h1>\n      <h3>\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043D\u0430  <a href=\"http://localhost:3000/auth\">\u0441\u0430\u0439\u0442</a></h3>\n  </body>\n  <html>");
                        }
                        else {
                            res.status(400).json({
                                status: 'error',
                                message: 'Пользователь не найден'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            errors: err_4
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                try {
                    user = req.user ? req.user.toJSON() : undefined;
                    res.json(__assign(__assign({}, user), { token: jsonwebtoken_1.default.sign({ data: req.user }, process.env.SECKRET_KEY || '8D@UID@2d22erf', {
                            expiresIn: 604800,
                        }) }));
                }
                catch (err) {
                    res.status(500).send({
                        status: 'error',
                        errors: err
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.getUserInfo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                try {
                    user = req.user ? req.user.toJSON() : undefined;
                    res.json({
                        status: 'success',
                        data: user,
                    });
                }
                catch (err) {
                    res.status(500).send({
                        status: 'error',
                        errors: err
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    return UserController;
}());
exports.UserCtrl = new UserController();

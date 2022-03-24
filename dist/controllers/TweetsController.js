"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetsCtrl = void 0;
var express_validator_1 = require("express-validator");
var TweetModel_1 = require("../models/TweetModel");
var isValidObjectId_1 = require("../utils/isValidObjectId");
var TweetsController = /** @class */ (function () {
    function TweetsController() {
    }
    // Request Get All Tweets
    TweetsController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tweets, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, TweetModel_1.TweetModel.find({}).populate('user').sort({ 'createdAt': '-1' }).exec()];
                    case 1:
                        tweets = _a.sent();
                        res.json({
                            status: 'success',
                            data: tweets
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
    TweetsController.prototype.show = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tweetId, tweet, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tweetId = req.params.id;
                        return [4 /*yield*/, TweetModel_1.TweetModel.findById(tweetId).populate('user')];
                    case 1:
                        tweet = _a.sent();
                        res.json({
                            status: 'success',
                            data: tweet
                        });
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
    // create Tweet
    TweetsController.prototype.create = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, errors, data, tweet, _a, _b, err_3;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, , 5]);
                        user = req.user;
                        if (!user) return [3 /*break*/, 3];
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            res.status(400).json({ status: 'error', errors: errors.array() });
                            return [2 /*return*/];
                        }
                        data = {
                            text: req.body.text,
                            user: user._id,
                            images: req.body.images,
                        };
                        return [4 /*yield*/, TweetModel_1.TweetModel.create(data)];
                    case 1:
                        tweet = _d.sent();
                        if (tweet._id) {
                            user.tweets.push(tweet._id);
                        }
                        _b = (_a = res.status(201)).send;
                        _c = {
                            status: 'success'
                        };
                        return [4 /*yield*/, tweet.populate('user')];
                    case 2:
                        _b.apply(_a, [(_c.data = _d.sent(),
                                _c)]);
                        _d.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_3 = _d.sent();
                        res.status(500).send({
                            status: 'error',
                            message: err_3.message
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // delete tweet 
    TweetsController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, errors, tweetId, tweet, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        user = req.user;
                        if (!user) return [3 /*break*/, 2];
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            res.status(400).json({ status: 'error', errors: errors.array() });
                            return [2 /*return*/];
                        }
                        tweetId = req.params.id;
                        return [4 /*yield*/, TweetModel_1.TweetModel.findById(tweetId)];
                    case 1:
                        tweet = _a.sent();
                        if (tweet) {
                            if (String(tweet.user._id) === String(user._id)) {
                                tweet.remove();
                                res.status(202).send({
                                    status: 'success',
                                    message: 'Successfully deleted tweet'
                                });
                            }
                            else {
                                res.status(403).send();
                            }
                        }
                        else {
                            res.status(404).send();
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            message: err_4.message
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // update tweet
    TweetsController.prototype.like = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tweet, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, TweetModel_1.TweetModel.findById(req.params.id)];
                    case 1:
                        tweet = _a.sent();
                        if (!!(tweet === null || tweet === void 0 ? void 0 : tweet.likes.includes(req.body.userId))) return [3 /*break*/, 3];
                        return [4 /*yield*/, (tweet === null || tweet === void 0 ? void 0 : tweet.updateOne({ $push: { likes: req.body.userId } }))];
                    case 2:
                        _a.sent();
                        res.status(201).json({ message: 'liked', liked: true });
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, (tweet === null || tweet === void 0 ? void 0 : tweet.updateOne({ $pull: { likes: req.body.userId } }))];
                    case 4:
                        _a.sent();
                        res.status(201).json({ message: 'disliked', liked: false });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_5 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            message: err_5.message
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TweetsController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, errors, tweetId, tweet, tweet_1, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        user = req.user;
                        if (!user) return [3 /*break*/, 6];
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            res.status(400).json({ status: 'error', errors: errors.array() });
                            return [2 /*return*/];
                        }
                        tweetId = req.params.id;
                        return [4 /*yield*/, TweetModel_1.TweetModel.findById(tweetId)];
                    case 1:
                        tweet = _a.sent();
                        if (!tweet) return [3 /*break*/, 5];
                        if (!(String(tweet.user._id) === String(user._id))) return [3 /*break*/, 3];
                        return [4 /*yield*/, TweetModel_1.TweetModel.findOneAndUpdate({ _id: req.params.id }, {
                                $set: {
                                    text: req.body.text,
                                }
                            }, { unsert: true })];
                    case 2:
                        tweet_1 = _a.sent();
                        res.status(200).send({
                            status: 'success',
                            data: tweet_1
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        res.status(403).send();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        res.status(404).send();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_6 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            message: err_6.message
                        });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    TweetsController.prototype.getUserTweets = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, tweet, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.params.id;
                        if (!(0, isValidObjectId_1.isValidObjectId)(userId)) {
                            res.status(404).send();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, TweetModel_1.TweetModel.find({ user: userId }).populate('user').exec()];
                    case 1:
                        tweet = _a.sent();
                        res.json({
                            status: 'success',
                            data: tweet
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        res.status(500).send({
                            status: 'error',
                            errors: err_7
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TweetsController;
}());
exports.TweetsCtrl = new TweetsController();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./core/db");
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var register_1 = require("./validations/register");
var passport_1 = require("./core/passport");
var createTweet_1 = require("./validations/createTweet");
// midlewares
// import { upload } from "./core/upload-photo"
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(passport_1.passport.initialize());
app.use((0, cors_1.default)());
// 
// require routes
var TweetsController_1 = require("./controllers/TweetsController");
var UploudImg_1 = require("./controllers/UploudImg");
var UserController_1 = require("./controllers/UserController");
// routes
// auth and User
app.get('/users', UserController_1.UserCtrl.index);
app.get('/users/me', passport_1.passport.authenticate('jwt', { session: false }), UserController_1.UserCtrl.getUserInfo);
app.get('/users/:id', UserController_1.UserCtrl.show);
app.post('/auth/register', register_1.registerValidations, UserController_1.UserCtrl.create);
app.get('/auth/verify', UserController_1.UserCtrl.verify);
app.post('/auth/login', passport_1.passport.authenticate('local'), UserController_1.UserCtrl.login);
// Tweeter 
app.get('/tweets', TweetsController_1.TweetsCtrl.index);
app.get('/tweet/:id', TweetsController_1.TweetsCtrl.show);
app.get('/tweet/user/:id', TweetsController_1.TweetsCtrl.getUserTweets);
app.delete('/tweet/:id', passport_1.passport.authenticate('jwt'), TweetsController_1.TweetsCtrl.delete);
app.post('/tweets', passport_1.passport.authenticate('jwt'), createTweet_1.createTweetValidations, upload.single("photo"), TweetsController_1.TweetsCtrl.create);
app.patch('/tweet/:id', passport_1.passport.authenticate('jwt'), TweetsController_1.TweetsCtrl.update);
app.patch('/tweet/like/:id', passport_1.passport.authenticate('jwt'), TweetsController_1.TweetsCtrl.like);
// app.patch('/tweet/:id', passport.authenticate('jwt'), TweetsCtrl.update)
// Uploud
app.post('/uploud', upload.single("image"), UploudImg_1.UploudCtrl.index);
app.listen(5000, function () {
    console.log(5000);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.mongoose = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
mongoose_1.default.Promise = Promise;
mongoose_1.default
    .connect("mongodb+srv://kerim:uvyfZIRGWnJvZHJq@cluster0.iwqrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(function (res) { return console.log("Connected to DB"); })
    .catch(function (error) { return console.log('connection error'); });
var db = mongoose_1.default.connection;
exports.db = db;
db.on("error", console.error.bind(console, "connection error"));

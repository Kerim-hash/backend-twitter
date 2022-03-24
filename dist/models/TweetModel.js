"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetModel = void 0;
var mongoose_1 = require("mongoose");
var TweetSchema = new mongoose_1.Schema({
    text: { required: true, type: String, maxlength: 280 },
    images: [{ type: String }],
    user: { required: true, type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: String }],
    liked: { required: true, default: false, type: Boolean }
}, {
    timestamps: true
});
exports.TweetModel = (0, mongoose_1.model)("Tweet", TweetSchema);

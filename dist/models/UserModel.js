"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    fullname: String,
    email: { type: String, unique: true, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true, },
    confirm_hash: { type: String, require: true },
    confirmed: { type: Boolean, default: false, },
    about: String,
    location: String,
    website: String,
    tweets: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Tweet" }],
}, { timestamps: true });
UserSchema.set('toJSON', {
    transform: function (_, obj) {
        delete obj.password;
        delete obj.confirm_hash;
        return obj;
    }
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);

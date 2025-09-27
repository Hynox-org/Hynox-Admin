"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var AdminSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
// Check if the model already exists before defining it
var Admin = mongoose_1.models.Admin || mongoose_1.default.model('Admin', AdminSchema);
exports.default = Admin;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("../../models/user.model.js");
db.role = require("../../models/role.model.js");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
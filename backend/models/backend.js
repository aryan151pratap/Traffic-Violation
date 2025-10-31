const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  url: {
	type: String,
	required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("backend", UserSchema);

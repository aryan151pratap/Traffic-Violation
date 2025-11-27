const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: String,
  vehicleType: String,
  challans: [
    {
      challanId: String,
      date: String,
      violation: String,
      location: String,
      fineAmount: Number,
      status: String,
      evidenceUrl: String
    }
  ]
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  password: { type: String },
  contact: { type: Number },
  email: { type: String, required: true, unique: true, trim: true },
  address: { type: String },
  licenseNumber: String,
  agreeToTerms: { type: Boolean, default: false },
  profile_img: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  vehicles: [VehicleSchema]

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

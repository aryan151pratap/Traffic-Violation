const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicleModel: {
    type: String,
  },
  vehicleImage: {
    type: String,
    default: null
  },
  challans: [
    {
      challanId: { type: String },
      violationType: { type: String },
      violationDate: { type: Date },
      fineAmount: { type: Number },
      status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
      evidenceImage: { type: String, default: null }
    }
  ]
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  password: { type: String },
  contact: { type: Number },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  address: { type: String },
  agreeToTerms: { type: Boolean, default: false },
  profile_img: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },

  vehicles: [VehicleSchema]

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

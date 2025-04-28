import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "merchant"], default: "customer" },
    image: { type: String, default: " " },
    isBanned: { type: Boolean, default: false },
    banReason: { 
          reason: { type: String },
          description: { type: String }
      },
    bannedAt: { type: Date },
    bannedBy: { type: String, required: function () { return this.isBanned; } },
    isEmailVerified: { type: Boolean, default: false },
    address: {
      state: { type: String, required: false },
      city: { type: String, required: false },
    },
    phoneNumber: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
    trashDate: {
      type: Date,
      default: null,
      expires: 2592000, // 30 days in seconds//30*24*60*60
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: function () { return this.role === "merchant"; },
    },
    rejectionReason: { 
      reason: { type: String },
      description: { type: String }
    },
    approvedBy: { type: String },
    merchantDetails: {
      tinNumber: { type: String, required: function () { return this.role === "merchant"; } },
      uniqueTinNumber: { type: String, unique: true, required: function () { return this.approvalStatus = "approved"; } },
      nationalId: { type: String, required: function () { return this.role === "merchant"; } },
      account: {
        name: { type: String, required: function () { return this.role === "merchant"; } },
        number: { type: String, required: function () { return this.role === "merchant"; } },
        bankCode: { type: String, required: function () { return this.role === "merchant"; } },
      },
    },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

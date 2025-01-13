import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    role: {
      type: String,
    },
    isBanned: {
      type: Boolean,
      default: false, 
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin", 
    },
  },
  { timestamps: true } 
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;

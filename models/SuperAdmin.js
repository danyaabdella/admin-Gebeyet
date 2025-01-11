import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
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
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt
);

const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;

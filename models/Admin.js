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
      default: false,  // Admin can be banned if true
    },
    createdAt: {
      type: Date,
      default: Date.now,  // Automatically set the creation date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",  // Reference to the SuperAdmin who created the admin
    },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;

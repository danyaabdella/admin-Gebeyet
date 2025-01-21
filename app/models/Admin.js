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
    trashDate: { 
      type: Date, 
      default: null,
      expires: 30 * 24 * 60 * 60,
    },    
    createdAt: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true } 
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;

import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['customer', 'merchant'],
        default: 'customer' 
      },
    image: { type: String, default: " " },
    isMerchant: { type: Boolean, default: false },
    approvedBy: { type: String, required: false },
    bannedBy: { type: String, required: false },
    tinNumber: { type: String, required: false },
    nationalId: { type: String, required: false },
    isBanned: { type: Boolean, default: false },

    stateName: { type: String, required: false },
    cityName: { type: String, required: false },
    phoneNumber: { type: String, required: false },

    isDeleted: { type: Boolean, default: false }, 
    trashDate: { 
      type: Date, 
      default: null, 
      expires: 30 * 60 * 60 * 60, 
    },

    // New required fields
    account_name: { type: String, required: true },
    account_number: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    reference: { type: String, required: true },
    bank_code: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
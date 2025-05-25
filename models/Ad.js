import mongoose, { Schema } from "mongoose";

const adSchema = new Schema(
  {
    product: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true },
    },
    price: { type: Number, required: true },
    isHome: {
      type: Boolean,
      default: false,
    },
    merchantDetail: {
      merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      merchantName: { type: String, required: true },
      merchantEmail: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
    },
    tx_ref: { type: String, required: true },
    chapaRef: { type: String },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    rejectionReason: {
      reason: { type: String },
      description: { type: String },
    },
    isActive: { type: Boolean, default: false },
    startsAt: { type: Date },
    endsAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

adSchema.index({ location: "2dsphere" });

adSchema.pre("save", async function (next) {
  if (this.isActive && this.isNew) {
    const activeNearbyCount = await mongoose.model("Ad").countDocuments({
      isActive: true,
      approvalStatus: "APPROVED",
      paymentStatus: "PAID",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: this.location.coordinates,
          },
          $maxDistance: 50000,
        },
      },
    });

    if (activeNearbyCount >= 3) {
      return next(
        new Error(
          "Maximum number of active, paid, and approved ads (10) within 50km radius reached."
        )
      );
    }
  }

  next();
});

const Ad = mongoose.models.Ad || mongoose.model("Ad", adSchema);
export default Ad;

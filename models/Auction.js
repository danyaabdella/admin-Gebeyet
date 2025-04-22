import mongoose from 'mongoose'

const auctionSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: String,
    condition: { type: String, enum: ['new', 'used'], required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    itemImg: [{ type: String, required: true }],
    startingPrice: { type: Number, required: true },
    reservedPrice: { type: Number, required: true },
    bidIncrement: { type: Number, default: 1 },
    rejectionReason: {
        category: { type: String },
        description: { type: String }
    },
    status: { 
        type: String, 
        enum: ['pending', 'active', 'ended', 'cancelled'],
        default: 'pending'
    },
    adminApproval: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    paymentDuration: { type: Number, default: 24 }, 
    totalQuantity: { type: Number, default: 1 },
    remainingQuantity: { type: Number },
    buyByParts: { type: Boolean, default: false },
    category: { type: String, required: false }
}, { timestamps: true })

auctionSchema.pre('save', function(next) {
    if (this.isNew) {
        this.remainingQuantity = this.totalQuantity
    }
    
    // Auto-update status based on timestamps
    const now = new Date()
    if (this.endTime < now) {
        this.status = 'ended'
    } else if (this.startTime <= now && this.status === 'pending') {
        this.status = 'active'
    }
    next()
})

// Indexes for better query performance
auctionSchema.index({ merchantId: 1, status: 1 })
auctionSchema.index({ status: 1, endTime: 1 })
auctionSchema.index({ category: 1, status: 1 })

const Auction = mongoose.models.Auction || mongoose.model('Auction', auctionSchema);

export default Auction;
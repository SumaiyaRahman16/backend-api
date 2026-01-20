const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: { type: String, required: true },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
        totalAmount: { type: Number, default: 0 },
        address: { type: Object }, // Make address optional
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);

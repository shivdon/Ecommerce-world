const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product",
      },
      count: Number,
      color: String,
    },
  ],
  paymentIntent: {},
  orderStatus: {
    type: String,
    default: "Not Processed",
    enum: [
      "Not Processed",
      "Processing",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ],
  },
  orderedBy: {type: ObjectId, ref: "User"}
}, {timestamps: true});

module.exports = mongoose.model("Order", orderSchema)
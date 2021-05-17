const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentsInteg = async (req, res) => {
  const { couponApplied } = req.body;
  console.log(couponApplied);

  //cart total
  let user = await User.findOne({ email: req.user.email }).exec();

  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  }).exec();

  // console.log("CART total ==> ", totalAfterDiscount);

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = (totalAfterDiscount * 100)
  } else {
    finalAmount = (cartTotal * 100)
  }

  //discount total whether coupon applied

  //payments intent by applying order amount and currency

  let createPaymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "inr",
  });

  res.send({
    clientSecret: createPaymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount
  });
};

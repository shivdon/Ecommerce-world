const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

exports.userCart = async (req, res) => {
  console.log(req.body.cart);
  const { cart } = req.body;

  let products = [];

  let user = await User.findOne({ email: req.user.email }).exec();

  //check if cart with user Id already exists
  let cartExistingWithUser = await Cart.findOne({ orderedBy: user._id }).exec();

  if (cartExistingWithUser) {
    cartExistingWithUser.remove();
    console.log("cart removed");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;

    //get Price for total
    let { price } = await Product.findById(cart[i]._id).select("price").exec();
    object.price = price;

    products.push(object);
  }

  cartTotal = 0;

  for (let i = 0; i < products.length; i++) {
    cartTotal += products[i].price * products[i].count;
  }

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  console.log(newCart);

  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  let user = await User.findOne({ email: req.user.email });

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { totalAfterDiscount, products, cartTotal } = cart;

  res.json({
    totalAfterDiscount,
    products,
    cartTotal,
  });
};

exports.emptyCart = async (req, res) => {
  let user = await User.findOne({ email: req.user.email });

  let cart = await Cart.findOneAndRemove({ orderedBy: user._id });

  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  let address = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  if (address) {
    res.json({ ok: true });
  }
};

exports.applyCouponDiscount = async (req, res) => {
  const { coupon } = req.body;

  let validCoupon = await Coupon.findOne({ name: coupon }).exec();

  if (validCoupon === null) {
    res.json({
      error: "Invalid Coupon",
    });
  }

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price")
    .exec();

  let totalAfterDiscount = cartTotal - cartTotal * (validCoupon.discount / 100);

  let updatedCart = await Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json({ discount: totalAfterDiscount });
};

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body;
  console.log(paymentIntent);

  let user = await User.findOne({ email: req.user.email }).exec();

  const { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();

  console.log(newOrder);

  let bulkOption = await products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log(updated);

  console.log("NEW ORDER ====>", newOrder);
  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec();

  let orders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  res.json(orders);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  let updated = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  let listWishlist = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(listWishlist);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ok: true})
};

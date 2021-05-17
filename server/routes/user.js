const express = require("express");

const router = express.Router();

//middlewares
const { authCheck } = require("../middlewares/auth");

//controllers
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponDiscount,
  createOrder,
  orders,
  wishlist,
  addToWishlist,
  removeFromWishlist
} = require("../controllers/user");

//route
router.get("/user/wishlist", authCheck, wishlist);
router.get("/user/orders", authCheck, orders);
router.get("/user/cart", authCheck, getUserCart);
router.post("/user/cart", authCheck, userCart);
router.post("/user/cart/coupon", authCheck, applyCouponDiscount);
router.post("/user/wishlist", authCheck, addToWishlist);
router.post("/user/order", authCheck, createOrder);
router.delete("/user/cart", authCheck, emptyCart);
router.put("/user/address", authCheck, saveAddress);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);






// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;

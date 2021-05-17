const express = require("express");
const router = express.Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const {
  create,
  listAll,
  deleteProduct,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters
} = require("../controllers/product");

router.get("/product/:slug", read);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.get("/product/related/:productId", listRelated);
router.post("/products", list);
router.post("/product", authCheck, adminCheck, create);
router.post("/search/filters", searchFilters)
router.delete("/product/:slug", authCheck, adminCheck, deleteProduct);
router.put("/product/:slug", authCheck, adminCheck, update);

router.put("/product/star/:product_id", authCheck, productStar);

//SEARCH


module.exports = router;

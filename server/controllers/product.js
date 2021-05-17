const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    res.json(await new Product(req.body).save());
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create Product Failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();

  res.json(products);
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = Product.findOneAndRemove({ slug: req.params.slug }).exec();
    res.json(deleted);
  } catch (err) {
    return res.send(400).send(err);
  }
};

exports.read = async (req, res) => {
  const productDetail = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(productDetail);
};

exports.update = async (req, res) => {
  try {
    const updatedValue = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    console.log(res);
    res.json(updatedValue);
  } catch (err) {
    console.log(err);
    res.status(400).send("product update failed");
  }
};

//without pagination
// exports.list = async (req, res) => {
//   try {
//     //sort: createdAt/UpdatedAt order: ascending/descending limit: how many to fetch
//     const { sort, order, limit } = req.body;

//     let products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .limit(parseInt(limit))
//       .sort([[sort, order]])
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

//with pagination

exports.list = async (req, res) => {
  try {
    //sort: createdAt/UpdatedAt order: ascending/descending page: current age selected
    const { sort, order, page } = req.body;
    currentPage = page || 1;
    //on one page how many to show
    perPage = 3;

    let products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .limit(parseInt(perPage))
      .sort([[sort, order]])
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let count = await Product.find({}).estimatedDocumentCount().exec();
  res.json(count);
};

exports.productStar = async (req, res) => {
  let product = await Product.findById(req.params.product_id).exec();
  let user = await User.findOne({ email: req.user.email }).exec();
  let { star } = req.body;

  //who is rating?
  //to find out whether the current user has left any rating previousy or not

  let existingRatingObject = product.ratings.find(
    (ele) => ele.postedBy.toString() === user._id.toString()
  );

  //if existingRatingObject is undefined that means the
  //current user hasn't left the rating on the roduct then add rating
  if (existingRatingObject === undefined) {
    //finding the product by id and adding to the ratings array by
    //$push method ($push: arrayName : elements to add)
    ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    res.json(ratingAdded);
  } else {
    //if user already left the rating and want to update the rating
    let ratingUpdated = await Product.updateOne(
      {
        //using elemMatch to find a particular element inside an array
        ratings: { $elemMatch: existingRatingObject },
      },
      {
        //set to add a new object to rating array by grabbing the particular element to update
        //in that array (for eg: grabbing star: using ratings.$.star)
        $set: { "ratings.$.star": star },
      },
      { new: true }
    ).exec();
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  let product = await Product.findById(req.params.productId).exec();

  let related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.json(related);
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category")
      .populate("subs")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
  let products = await Product.find({ category })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(products);
};

const handleStars = async (req, res, stars) => {
  try {
    let averageStarsAggregate = await Product.aggregate([
      {
        $project: {
          //fetch all items from the model
          document: "$$ROOT",
          //create new item based on the aggregation
          floorAverage: {
            $floor: { $avg: "$ratings.star" },
          },
        },
      },
      { $match: { floorAverage: stars } },
    ])
      .limit(12)
      .exec();

    let products = await Product.find({ _id: averageStarsAggregate })
      .populate("category")
      .populate("subs")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleSubs = async (req, res, sub) => {
  let products = await Product.find({ subs: sub })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(products);
};

const handleShipping = async (req, res, shipping) => {
  let products = await Product.find({ shipping })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  let products = await Product.find({ color })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  let products = await Product.find({ brand })
    .populate("category")
    .populate("subs")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    color,
    brand,
  } = req.body;

  if (query) {
    console.log("query", query);
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    console.log(price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log(category);
    await handleCategory(req, res, category);
  }

  if (stars) {
    console.log(stars);
    await handleStars(req, res, stars);
  }

  if (sub) {
    console.log(sub);
    await handleSubs(req, res, sub);
  }

  if (shipping) {
    console.log(shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log(color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log(brand);
    await handleBrand(req, res, brand);
  }
};

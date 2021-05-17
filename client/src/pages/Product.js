import React, { useEffect, useState } from "react";
import {
  getProduct,
  productStar,
  getRelatedProduct,
} from "../functions/product";
import SingleProduct from "../components/cards/SingleProduct";
import { useSelector } from "react-redux";
import LoadingCard from "../components/cards/LoadingCard";
import ProductCard from "../components/cards/ProductCard";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const { slug } = match.params;

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );

      existingRatingObject && setRating(existingRatingObject.star); // current logged in user's star rating on the product
    }
  });

  const loadProduct = () => {
    setLoading(true);
    getProduct(slug).then((res) => {
      setProduct(res.data);
      getRelatedProduct(res.data._id).then((res) => {
        setLoading(false);
        setRelatedProduct(res.data);
      });
    });
  };

  const onStarClick = (newRating, name) => {
    setRating(newRating);
    productStar(name, newRating, user.token).then((res) => {
      console.log(res.data);
      loadProduct();
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          rating={rating}
          onStarClick={onStarClick}
        />
      </div>
      <div className="row p-5">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        <div className="container">
          {loading ? (
            <LoadingCard count={3} />
          ) : (
            <div className="row">
              {relatedProduct.length ? relatedProduct.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              )): <div className="text-center col">No Related Products Found </div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

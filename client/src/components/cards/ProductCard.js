import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";
import { showAverage } from "../../functions/rating";
import lodash from "lodash";
import { useSelector, useDispatch } from "react-redux";

const { Meta } = Card;
const ProductCard = ({ product }) => {
  const [tooltip, setTooltip] = useState("Click To Add");
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    //check whether the window for saving the product in local storage exists
    let cart = [];

    if (typeof window !== undefined) {
      //getting if any previous item exists in local storage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // spreading the product and adding a default value count
      cart.push({
        ...product,
        count: 1,
      });

      //removing duplicates using lodash
      let uniqueCartArray = lodash.uniqWith(cart, lodash.isEqualWith);

      localStorage.setItem("cart", JSON.stringify(uniqueCartArray));

      //dispatch to the redux store
      dispatch({
        type: "ADD_TO_CART",
        payload: uniqueCartArray,
      });
      setTooltip("Added");
    }
    // when item added to cart the drawer state should be true to be shown
    dispatch({
      type: "DRAWER_VISIBILITY",
      payload: true,
    });
  };

  const { images, description, slug, title } = product;
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No Rating Yet.</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length > 0 ? images[0].url : laptop}
            style={{ height: "200px", objectFit: "cover" }}
            className="p-3"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-primary" /> <br /> View Product
          </Link>,
          <>
            <Tooltip title={tooltip}>
              <a onClick={() => handleAddToCart()}>
                <ShoppingCartOutlined className="text-danger" /> <br />
                {product.quantity === 0 ? (
                  <div className="text-danger">Out Of Stock</div>
                ) : (
                  "Add to Cart"
                )}
              </a>
            </Tooltip>
          </>,
        ]}
      >
        <Meta
          title={title}
          description={`${description && description.substring(0, 30)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;

import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import {
  getUserWishlist,
  removeProductFromWishlist,
} from "../../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Spin } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";

const { Meta } = Card;


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user, cart } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    setLoading(true);
    getUserWishlist(user.token).then((res) => {
      console.log(res.data.wishlist);
      setWishlist(res.data.wishlist);
      setLoading(false);
    });
  };

  const handleRemove = (productId) =>
    removeProductFromWishlist(user.token, productId).then((res) => {
      console.log(res.data);
      if (res.data.ok) {
        loadWishlist();
      }
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {loading ? (
            <Spin className="m-5" />
          ) : (
            <div className="row mt-5">
              {wishlist.map((w) => (
                <div className="col-md-4">
                  <Card
                    cover={
                      <img
                      src={w.images && w.images.length > 0 ? w.images[0].url : laptop}
                        style={{ height: "200px", objectFit: "cover" }}
                        className="p-3"
                      />
                    }
                    actions={[
                      <Link to={`/product/${w.slug}`}>
                        <EyeOutlined className="text-info" /> <br /> View
                        Product
                      </Link>,
                      <div onClick={() => handleRemove(w._id)}>
                        <DeleteOutlined className="text-danger" /> <br /> Remove
                        from Wishlist
                      </div>,
                    ]}
                  >
                    <Meta title={w.title} description={`${w.description.substring(0, 40)} .....`} />
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyDiscount,
} from "../functions/user";
import { Button, Card, Input } from "antd";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {
  const { user, pageState } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountErr, setDiscountErr] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log(res.data);
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const handleEmptyCart = () => {
    if (typeof window !== undefined) {
      localStorage.removeItem("cart");
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });

    emptyUserCart(user.token).then((res) => {
      console.log(res.data);
      toast.success("Cart Empty ! let's Countinue SHOPPING!!!");
      setProducts([]);
    });

    setTimeout(() => {
      history.push("/shop");
    }, 5000);
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address Saved Successully");
      }
    });
  };

  const applyDiscountCoupon = () => {
    applyDiscount({ coupon }, user.token).then((res) => {
      if (res.data.error) {
        setDiscountErr(res.data.error);
        toast.error(`"${coupon}" is not Valid`);
        setShow(false);
      }

      if (res.data.discount) {
        setDiscountPrice(res.data.discount);
        toast.success(
          `A total of ₹ ${(
            total - res.data.discount
          ).toLocaleString()}  is applied on the coupon code ==> ${coupon}`
        );
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
        setShow(true);
      }
    });
  };

  const showApplyCoupon = () => (
    <div className="row">
      <div className="col-md-6">
        <Input
          type="text"
          className=""
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter Coupon code"
        />
        <button
          className="btn btn-primary btn-raised mt-2"
          onClick={applyDiscountCoupon}
        >
          Apply Coupon
        </button>
      </div>
    </div>
  );

  const handlePaymentSession = () => {
    history.push("/payment")
    dispatch({
      type: "SESSION",
      payload: true
    })
  }

  return (
    <div className="row">
      <div className="col-md-6 p-5">
        <h4>Delivery Address</h4>
        <br />
        <br />
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button
          className="btn btn-secondary btn-raised mt-2 btn-block"
          onClick={saveAddressToDb}
        >
          Save Delivery Address
        </button>
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
      </div>

      <div className="col-md-6">
        <Card className="m-3">
          <div className="pt-4 pb-4 ">
            <h4>Order Summary</h4>

            <p className="text-primary h5 mb-5">
              {products.length} Products in the cart
            </p>
            <div className="mb-5">
              <ul className="list-group">
                {products.map((p, i) => (
                  <li className="list-group-item" key={i}>
                    <p className="cart-details text-secondary">
                      {p.product.title}
                    </p>
                    <span className="label label-default label-pill pull-xs-right cart-details">
                      ₹ {p.product.price.toLocaleString("en-IN")} x {p.count} = ₹{" "}
                      {(p.product.price * p.count).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            {!show ? (
              <h5 className="text-right">
                <span className="text-secondary">Cart Total :</span>
                <strong> ₹ {total.toLocaleString()} </strong>
              </h5>
            ) : (
              <>
                <h5 className="text-right">
                  <span className="text-secondary">Cart Total :</span>
                  <strong>
                    <del> ₹ {total.toLocaleString("en-IN")} </del>
                  </strong>
                </h5>
                <h5 className="text-right">
                  <span className="text-secondary">
                    Discounted Cart Total :
                  </span>
                  <strong> ₹ {discountPrice.toLocaleString("en-IN")}</strong>
                </h5>
              </>
            )}
          </div>
        </Card>

        <div className="row mt-4">
          <div className="col-md-6">
            <button
              className="btn btn-primary btn-raised btn-block ml-3"
              disabled={!addressSaved || !products.length}
              onClick={handlePaymentSession}
            >
              Place Order
            </button>
          </div>
          <div className="col-md-6 pr-4">
            <button
              className="btn btn-danger btn-raised btn-block "
              onClick={handleEmptyCart}
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

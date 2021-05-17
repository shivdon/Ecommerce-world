import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentsIntent } from "../../functions/stripe";
import { Link } from "react-router-dom";
import { Card, Button } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";
import { useHistory } from "react-router-dom";
import { createOrder, emptyUserCart } from "../../functions/user";

const StripeCheckout = () => {
  const { user, coupon, pageState } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    let payment = stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });

    if (payment.error) {
      setError(`Payment Failed ${(await payment).error.message}`);
      setProcessing(false);
    } else {
      //here we will recieve successful payment response
      console.log((await payment).paymentIntent)
      const stripeResponse = (await payment).paymentIntent;
      //orders on the admin dashboard
      createOrder(stripeResponse, user.token).then((res) => {
        //empty cart from everywhere

        if (res.data.ok) {
          //remove cart from local storage
          if (typeof window !== undefined) localStorage.removeItem("cart");

          //remove cart from redux
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });

          //remove cart from database
          emptyUserCart(user.token);

          //coupon set back to false

          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
        }
      });

      console.log(payment);
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleChange = async (e) => {
    //show error if the information entered is incorrect and
    //also disable the button for the pay if error found

    setError(e.error ? e.error.message : "");
    setDisabled(e.empty);
  };

  const handleSessionEnd = () => {
    history.push("/user/history");
    dispatch({
      type: "SESSION",
      payload: false,
    });
  };

  useEffect(() => {
    createPaymentsIntent(user.token, coupon).then((res) => {
      console.log(res.data);
      setClientSecret(res.data.clientSecret);
      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
    });
  }, []);

  return (
    <>
      {pageState ? (
        <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
          {!succeeded && (
            <div>
              {coupon && totalAfterDiscount !== undefined ? (
                <p className="alert alert-success">
                  Coupon Applied. You Save: ₹
                  {(cartTotal - totalAfterDiscount).toLocaleString("en-IN")}
                </p>
              ) : (
                <p className="alert alert-danger">No Coupon Applied</p>
              )}
            </div>
          )}

          <div className="text-center pb-5">
            <Card
              cover={
                <img
                  src={laptop}
                  style={{
                    height: "50px",
                    objectFit: "cover",
                    marginBottom: "-50px",
                  }}
                />
              }
              actions={[
                <>
                  <DollarOutlined className="text-info mt-1" />
                  <br /> Total : ₹ {cartTotal.toLocaleString("en-IN")}
                </>,
                <>
                  <CheckOutlined className="text-info mt-1" />
                  <br /> payable: ₹ {(payable / 100).toLocaleString("en-IN")}
                </>,
              ]}
            />
          </div>

          <CardElement
            id="card-element"
            onChange={handleChange}
            options={cartStyle}
          />
          <button
            className="stripe-button"
            disabled={processing || disabled || processing}
          >
            <span id="button-text">
              {processing ? <div className="spinner" id="sinner"></div> : "Pay"}
            </span>
          </button>
          <br />
          {error ? (
            <div className="card-error text-danger" role="alert">
              {error}
            </div>
          ) : (
            " "
          )}

          <p className={succeeded ? "result-message" : "result-message hidden"}>
            Payment Successful{" "}
            <Button
              type="link"
              className={succeeded ? "result-message" : "result-message hidden"}
              onClick={handleSessionEnd}
            >
              Check Your Order status here
            </Button>
          </p>
        </form>
      ) : (
        <div className="h-100 w-100">
          <p className="alert alert-secondary mx-auto my-auto">
            Session Expired. <Link to="/cart">Try Again.</Link>
          </p>
        </div>
      )}
    </>
  );
};

export default StripeCheckout;

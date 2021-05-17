import axios from "axios";

export const createPaymentsIntent = async (authtoken, coupon) =>
  await axios.post(
    `${process.env.REACT_APP_API}/create-payment-integration`,
    {couponApplied: coupon},
    {
      headers: {
        authtoken,
      },
    }
  );

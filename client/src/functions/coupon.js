import axios from "axios";

export const getCoupons = async () =>
  await axios.get(`${process.env.REACT_APP_API}/coupons`);

export const deleteCoupon = async (authtoken, coupon_id) =>
  await axios.delete(`${process.env.REACT_APP_API}/coupon/${coupon_id}`, {
    headers: {
      authtoken,
    },
  });

export const createCoupon = async (authtoken, coupon) =>
  await axios.post(`${process.env.REACT_APP_API}/coupon`, coupon, {
    headers: {
      authtoken,
    },
  });

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
} from "../../../functions/coupon";
import AdminNav from "../../../components/nav/AdminNav";
import "react-datepicker/dist/react-datepicker.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const CreateCoupon = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    setLoading(false);
    getCoupons().then((res) => {
      setCoupons(res.data);
      setLoading(false);
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(name, expiry, discount);

    createCoupon(user.token, { name, expiry, discount })
      .then((res) => {
        setLoading(true);
        setName("");
        setExpiry("");
        setDiscount("");
        toast.success(`${res.data.name} is created`);
        loadCoupons();
      })
      .catch((err) => console.log(err));
  };

  const handleRemove = (coupon_id) => {
    setLoading(true);
    deleteCoupon(user.token, coupon_id)
      .then((res) => {
        setLoading(false);
        toast.error(`${res.data.name} deleted Successfully`);
        loadCoupons();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Coupon</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="number"
                className="form-control"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                selected={expiry}
                onChange={(date) => setExpiry(date)}
                className="form-control"
                required
              />
            </div>

            <button
              className="btn btn-primary btn-raised btn-large"
              onClick={handleSubmit}
            >
              Create Coupon
            </button>
          </form>
           
          {loading ? (
            <Spin className="text-center" />
          ) : (
            <div>
              {coupons.length > 0 &&
                coupons.map((c) => (
                  <div className="alert alert-secondary" key={c._id}>
                    {c.name}
                    <span
                      className="float-right"
                      onClick={() => handleRemove(c._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <DeleteOutlined className="text-danger" />
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;

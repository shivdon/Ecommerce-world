import React, { useEffect, useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { Link } from "react-router-dom";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getUserOrders } from "../../functions/user";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../components/order/Invoice";
import { Spin } from "antd";

const History = () => {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    getUserOrders(user.token).then((res) => {
      console.log(res.data);
      setOrders(res.data);
      setLoading(false);
    });
  };

  const showOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Quantity</th>
          <th scope="col">Shipping</th>
          <th scope="col">Delivery Status</th>
        </tr>
      </thead>

      <tbody>
        {order.products.map((p, i) => (
          <tr key={i}>
            <td>
              <strong>{p.product.title}</strong>
            </td>
            <td>{p.product.price}</td>
            <td>{p.product.brand}</td>
            <td>{p.product.color}</td>
            <td>{p.count}</td>
            <td>
              {p.product.shipping === "Yes" ? (
                <CheckCircleOutlined style={{ color: "green" }} />
              ) : (
                <CloseCircleOutlined className="text-danger" />
              )}
            </td>
            <td>{order.orderStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const showDowloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-outline-primary"
    >
      Download Invoice
    </PDFDownloadLink>
  );

  const showEachOrders = () =>
    orders.map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        {/* <ShowPaymentInfo order={order} /> */}

        {showOrderInTable(order)}
        <div className="row">
          <div className="col text-center">{showDowloadLink(order)}</div>
        </div>
      </div>
    ));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>

        <div className="col">
          {loading ? (
            <div className="h-100 w-100">
              <Spin className="mx-auto my-auto" />
            </div>
          ) : (
            <>
              <h4>
                {orders.length > 0 ? "User Purchase Orders" : "No Orders"}
              </h4>
              {showEachOrders()}{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;

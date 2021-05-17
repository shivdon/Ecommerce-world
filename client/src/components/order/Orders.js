import React, { useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../components/order/Invoice";
import { Select } from "antd";
const { Option } = Select;

const statusOptions = [
  "Not Processed",
  "Processing",
  "Dispatched",
  "Delivered",
  "Cancelled",
];

const Orders = ({ orders, handleStatusChange }) => {
  const [option, setOptions] = useState("Not Processed");

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
      <div key={order._id}>
        <div className="m-5 p-3 card">
          {/* <ShowPaymentInfo order={order} /> */}

          {showOrderInTable(order)}
          <div className="row">
            <div className="col">
              <div className="text-left">{showDowloadLink(order)}</div>
              <div className="text-right">
                <span className="h5">Delivery Status: </span>
                <Select
                  defaultValue={order.orderStatus}
                  onChange={(value) => {
                    handleStatusChange(order._id, value);
                  }}
                >
                  {statusOptions.map((op) => <Option value={op} key={op} >{op}</Option> )}
                    
                    
                  
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

  return <>{showEachOrders()}</>;
};

export default Orders;

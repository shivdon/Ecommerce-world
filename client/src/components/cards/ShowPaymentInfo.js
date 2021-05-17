import React from "react";


const ShowPaymentInfo = ({order}) => (
     <div>
    {/* //     <p>
    //         <span>Order ID: {order.paymentIntent.id} </span>{" "}
    //         <span>  {" "}
    //         ₹ {(order.paymentIntent.amount/100).toLocaleString("en-IN")}
    //          </span>{" "}
    //          <span>Currency {order.paymentIntent.currency.toUpperCase()}</span>{" "}
    //          <span>Method: {order.paymentIntent.payment_method_types[0]} </span>{" "}
    //          <span>Payment Status: {order.paymentIntent.status.toUpperCase()}</span>{" "}
    //          <span>Ordered On: {new Date(order.createdAt).toLocaleDateString()}</span>
    //          <span className="badge bg-primary text-white">
    //              STATUS: {order.orderStatus}
    //          </span>
    //     </p> */}
    </div>
)

export default ShowPaymentInfo;
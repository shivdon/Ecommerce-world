import React from "react";
import ImageModal from "react-modal-image";
import laptop from "../../images/laptop.png";
import { useDispatch } from "react-redux";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ProductCartTable = ({ product }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  const { title, price, brand, count, images, color, shipping } = product;

  const dispatch = useDispatch();

  const handleValueChange = (e) => {
    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
    }

    cart.map((p, i) => {
      if (product._id === p._id) {
        cart[i] = { ...cart[i], [e.target.name]: e.target.value };
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  };

  const handleRemove = (e) => {
    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
    }

    cart.map((p, i) => {
      if (product._id === p._id) {
        cart.splice(i, 1);
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {images.length ? (
              <ImageModal small={images[0].url} large={images[0].url} />
            ) : (
              <ImageModal small={laptop} large={laptop} />
            )}
          </div>
        </td>
        <td className="text-center">{title}</td>
        <td >Rs. {price}</td>
        <td className="text-center">{brand}</td>
        <td className="text-center">
          <select
            className="form-control"
            name="color"
            onChange={handleValueChange}
          >
            {color ? (
              <option value={color}>{color}</option>
            ) : (
              <option>---Select---</option>
            )}
            {colors
              .filter((c) => c !== color)
              .map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
          </select>
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            name="count"
            onChange={handleValueChange}
            defaultValue={count}
          />
        </td>
        <td className="text-center">
          {shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" />
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td className="text-center">
          <CloseOutlined
            style={{ cursor: "pointer" }}
            className="text-danger"
            onClick={handleRemove}
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCartTable;

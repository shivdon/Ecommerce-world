import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount, deleteProduct } from "../../../functions/product";
import { Spin } from "antd";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleDeleteProduct = (slug, title) => {
    setLoading(true);
    deleteProduct(slug, user.token)
      .then((res) => {
        setLoading(false);
        console.log(res);
        toast.error(`${title} successfully deleted`);
        loadProducts();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.err);
        console.log(err);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? <Spin /> : <h1>All Products</h1>}
          <div className="row">
            {products.map((p) => (
              <div className="col-md-4 pb-3" key={p._id}>
                <AdminProductCard
                  product={p}
                  handleDeleteProduct={handleDeleteProduct}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

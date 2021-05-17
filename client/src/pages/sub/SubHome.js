import React, { useState, useEffect } from "react";
import ProductCard from "../../components/cards/ProductCard";
import { getSub } from "../../functions/sub";
import { Spin } from "antd";

const SubHome = ({ match }) => {
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    getSub(slug).then((res) => {
      console.log(res);
      setSub(res.data.sub);
      setProducts(res.data.products);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {loading ? (
            <Spin className="text-center" />
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron text-danger">
              {products.length} Products in "{sub.name}" Sub Category
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubHome;

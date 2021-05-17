import React, { useEffect, useState } from "react";
import { getCategory } from "../../functions/category";
import ProductCard from "../../components/cards/ProductCard";
import { Spin } from "antd";

const CategoryHome = ({ match }) => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getCategory(slug).then((res) => {
      setCategory(res.data.category);
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
              {products.length} Products in "{category.name}" Category
            </h4>
          )}
          <div className="row">
            {products &&
              products.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHome;

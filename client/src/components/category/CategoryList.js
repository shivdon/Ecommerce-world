import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../functions/category";
import { Spin } from "antd";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories().then((c) => {
      setCategories(c.data);
      setLoading(false);
    });
    return () => getCategories();
  }, []);

  const showCategories = () =>
    categories.map((c) => (
      <div className="col" key={c._id}>
        <Link to={`category/${c.slug}`}>
          <div
            className="btn btn-outlined-primary btn-lg btn-block btn-raised m-4 text-primary"
            key={c._id}
          >
            {c.name}
          </div>
        </Link>
      </div>
        
      
    ));
  return (
    <div className="container">
      <div className="row">
        {loading ? <Spin className="text-center" /> : showCategories()}
      </div>
    </div>
  );
};

export default CategoryList;

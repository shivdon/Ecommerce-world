import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct
} from "../../../functions/product";
import { getCategories, getSubs } from "../../../functions/category";
import { Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import FileUpload from "../../../components/forms/FileUpload";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Microsoft", "Samsung", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

const ProductUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [categories, setCategories] = useState([]);
  const [arrSubsIds, setArrSubsIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(match.params.slug).then((res) => {
      setValues({ ...values, ...res.data });
      // prepoulation the subs by loading the single category subs
      getSubs(res.data.category._id).then((s) => {
        setSubOptions(s.data);
      });

      //default value loading for subs
      let arr = [];
      res.data.subs.map((s) => {
        arr.push(s._id);
      });
      console.log(arr);
      setArrSubsIds((prev) => arr);
    });
  };

  const loadCategories = () => {
    getCategories().then((c) => {
      setCategories(c.data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    values.subs = arrSubsIds;
    updateProduct(match.params.slug, values, user.token)
    .then(res => {
      setLoading(false)
      toast.success(`${res.data.title} updated successfully`)
      history.push("/admin/products")
      
    })
    .catch((err) => {
      setLoading(false)
      console.log(err)
      toast.error(err.response.data.err);
    })

  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubsChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [], category: e.target.value });
    getSubs(e.target.value).then((res) => {
      console.log(res.data);
      setSubOptions(res.data);
    });
    setArrSubsIds([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
        {loading ? <Spin className="mt-3"/> : <h4>Product Update</h4>}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            handleSubsChange={handleSubsChange}
            categories={categories}
            setCategories={setCategories}
            subOptions={subOptions}
            arrSubsIds={arrSubsIds}
            setArrSubsIds={setArrSubsIds}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;

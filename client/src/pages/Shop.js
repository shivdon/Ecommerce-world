import React, { useEffect, useState } from "react";
import {
  getProductsByCount,
  fetchProductsBySearchFilter,
} from "../functions/product";

import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { Spin, Menu, Slider, Checkbox, Badge, Button } from "antd";
import { DownSquareOutlined, StarOutlined } from "@ant-design/icons";
import Star from "../components/forms/Star";

const { SubMenu } = Menu;

const colors = ["Black", "Brown", "Silver", "White", "Blue"];
const brands = ["Apple", "Microsoft", "Samsung", "Lenovo", "ASUS"];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState();
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");

  const dispatch = useDispatch();

  let { search } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllProducts();
    loadAllCategories();
    getSubs().then((res) => setSubs(res.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsBySearchFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  //1. loading the products by default
  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  const dispatcherText = () => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
  };

  //2. loading the products based on search query

  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchProducts({ query: search.text });
      if(!search.text) {
        loadAllProducts()
      }
    }, 300);

    return () => clearTimeout(timeOut);
  }, [search.text]);

  //3. load Products based on Price Range

  useEffect(() => {
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatcherText();
    setPrice(value);
    setCategoryIds([]);
    setStar(0);
    setSub("");
    setColor("");

    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  //4. load products based on categories

  const loadAllCategories = () =>
    getCategories().then((res) => setCategories(res.data));

  //show categories im a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          className="pb-2 pl-4 pr-4"
          value={c._id}
          onChange={handleCheck}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  //handle checked value for categories
  const handleCheck = (e) => {
    dispatcherText();
    setPrice([]);
    setStar(0);
    setSub("");
    setColor("");

    let inTheState = [...categoryIds];
    let itemSelected = e.target.value;
    let checkInTheState = inTheState.indexOf(itemSelected);

    if (checkInTheState === -1) {
      inTheState.push(itemSelected);
    } else {
      inTheState.splice(checkInTheState, 1);
    }

    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. load products based on the Star rating
  const handleStarClick = (num) => {
    dispatcherText();
    setPrice([]);
    setCategoryIds([]);
    setStar(num);
    setSub("");
    setColor("");
    console.log(num);
    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  //6. load products based on subs
  const showSubs = () => (
    <div className="pl-4 pr-4 pb-2">
      {subs.map((s) => (
        <div
          key={s._id}
          className="p-1 m-1 badge badge-info"
          style={{ cursor: "pointer" }}
          onClick={() => handleSub(s)}
        >
          {s.name}
        </div>
      ))}
    </div>
  );

  const handleSub = (sub) => {
    dispatcherText();
    setPrice([]);
    setCategoryIds([]);
    setStar(0);
    setSub(sub);
    setColor("");
    fetchProducts({ sub });
  };

  //load Products ased on colors
  const showColors = () => {
    return (
      <div className="pb-2 pl-4 pr-5">
        {colors.map((c) => (
          <div key={c} className="m-2">
            <Button
              block
              style={{ background: c.toLowerCase() }}
              onClick={() => handleColorClick(c)}
            >
              {c.name}{" "}
            </Button>
            <br />
          </div>
        ))}
      </div>
    );
  };

  const handleColorClick = (color) => {
    dispatcherText();
    setPrice([]);
    setCategoryIds([]);
    setStar(0);
    setSub("");
    setColor(color);

    fetchProducts({ color });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 p-3 mt-5 mb-5">
          <h4 className="text-primary text-center mt-2">Search/Filter</h4>
          <hr />

          <Menu mode="inline" defaultOpenKeys={["1", "2", "3", "4", "5"]}>
            {/* Price */}
            <SubMenu key="1" title={<span className="h6">₹ Price</span>}>
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => ` ₹ ${v}`}
                  range={{ draggableTrack: true }}
                  max="499999"
                  value={price}
                  onChange={handleSlider}
                />
              </div>
            </SubMenu>

            {/* Categories */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showCategories()}</div>
            </SubMenu>

            {/* Star Rating */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showStars()}</div>
            </SubMenu>
            {/*sub Categories  */}
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <StarOutlined /> Sub Categories
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showSubs()}</div>
            </SubMenu>

            {/* Colors */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <StarOutlined /> Colors
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showColors()}</div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9">
          {loading ? (
            <Spin />
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron text-danger">
              Products
            </h4>
          )}

          <div className="row">
            {products.length > 0 &&
              products.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            {products.length === 0 && (
              <p className="text-warning">No Products Found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

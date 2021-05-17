import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategories } from "../../../functions/category";
import {
  createSub,
  getSub,
  getSubs,
  removeSub,
  updateSub,
} from "../../../functions/sub";
import { Spin, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const { Option } = Select;
const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subsData, setSubsData] = useState([]);
  const [filterCategory, setFilterCategory] = useState("")

  //search filter
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () => {
    getCategories().then((c) => setCategories(c.data));
  };

  const loadSubs = () => getSubs().then((c) => setSubsData(c.data));

  const handleRemove = (slug) => {
    if (window.confirm("Delete Sub?")) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`${res.data.name} deleted successfully`);
          loadSubs();
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.status === 400) toast.error(`${err.response.data}`);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadSubs();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const searched = (filterCategory) => (category) =>
    category.parent.includes(filterCategory)

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? <Spin /> : <h4>Create Sub category</h4>}

          <div className="form-group">
            {categories.length > 0 && (
              <Select
                defaultValue="Pick Category"
                onChange={(value) => setCategory(value)}
              >
                {categories.map((c) => (
                  <Option value={c._id} key={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            )}
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          
          <div className="form-group">
          <label className="pr-3">filter: </label>
            {categories.length > 0 && (
              <Select
                defaultValue="Pick Category"
                onChange={(value) => setFilterCategory(value)}
              >
                {categories.map((c) => (
                  <Option value={c._id} key={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            )}
          </div>


          <hr />
          
          

          {subsData.filter(searched(filterCategory)).map((s) => (
            <div className="alert alert-secondary" key={s._id}>
              {s.name}
              <span
                onClick={() => handleRemove(s.slug)}
                className="btn float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <span className="btn float-right">
                <Link to={`/admin/sub/${s.slug}`}>
                  <EditOutlined className="text-primary" />
                </Link>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCreate;

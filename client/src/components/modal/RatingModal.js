import React, { useState } from "react";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { StarOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

const RatingModal = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [modalVisible, setModalVisible] = useState(false);
  let history = useHistory();
  let { slug } = useParams();
  console.log(slug);
  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      history.push({
        pathname: "/login",
        state: {
          from: `/product/${slug}`,
        },
      });
    }
  };
  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined className="text-warning" /> <br />{" "}
        {user ? "leave rating" : "login to leave rating"}
      </div>
      <Modal
        title="leave rating"
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success("rating added successfully");
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;

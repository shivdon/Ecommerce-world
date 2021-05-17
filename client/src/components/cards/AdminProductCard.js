import React from "react";
import { Card } from "antd";
import laptop from "../../images/laptop.png";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {Link} from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = ({ product, handleDeleteProduct }) => {
  const { images, description, slug, title } = product;
  return (
    <Card
      cover={
        <img
          src={images && images.length > 0 ? images[0].url : laptop}
          style={{ height: "200px", objectFit: "cover" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-primary" />
        </Link>,
        <DeleteOutlined
          className="text-danger"
          onClick={() => handleDeleteProduct(slug, title)}
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 50)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;

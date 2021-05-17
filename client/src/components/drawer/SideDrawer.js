import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Drawer, Button } from "antd";
import laptop from "../../images/laptop.png";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  const handleCloseDrawer = () => {
    dispatch({
      type: "DRAWER_VISIBILITY",
      payload: false,
    });
  };

  return (
    <Drawer
      visible={drawer}
      onClose={handleCloseDrawer}
      title={`Cart / ${cart.length} Products`}
      placement="right"
      closable={true}
    >
      {cart.map((p) => (
        <div className="row" key={p._id}>
          <div className="col">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} className="sidedrawer-image" />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={laptop} className="sidedrawer-image" />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count} h
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link to="/cart">
        <Button
          block
          className="btn btn-primary btn-raised"
          onClick={() => {
            dispatch({
              type: "DRAWER_VISIBILITY",
              payload: false,
            });
          }}
        >
          GO TO CART
        </Button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;

import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import CategoryList from "../components/category/CategoryList";
import BestSellers from "../components/home/BestSellers";
import NewArrivals from "../components/home/NewArrivals";

const Home = () => {
  return (
    <>
      <div className="jumbotron text-primary h1 font-weight-bold text-center">
        <Jumbotron text={["New Arrivals", "Best Sellers", "Latest Products"]} />
      </div>
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron text-danger">
        New Arrivals
      </h4>
      <NewArrivals />
      <br />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron text-danger">
        Best Sellers
      </h4>
      <BestSellers />
      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron text-danger">
        Categories
      </h4>
      <CategoryList />
      
      <br />
    </>
  );
};

export default Home;

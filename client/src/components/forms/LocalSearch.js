import React from "react";


const LocalSearch = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
      e.preventDefault();
      setKeyword(e.target.value.toLowerCase());
  };

  return (
    <div className="container pt-4 pb-4">
      <input
        type="search"
        className="form-control mB-4"
        value={keyword}
        onChange={handleSearchChange}
        placeholder="Filter"
      />
    </div>
  );
};


export default LocalSearch;
import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (p) => {
  let ratingArray = p && p.ratings;
  let total = [];
  let length = ratingArray.length;

  ratingArray.map((r) => total.push(r.star));
  let sumRatingStars = total.reduce((p, n) => p + n, 0);
  let average = sumRatingStars / length;

  return (
    <div className="text-center pt-1 pb-3">
      <span>
        <StarRating
          starDimension="20px"
          starSpacing="2px"
          starRatedColor="red"
          rating={average}
          editing={false}
        /> ({length})
      </span>
    </div>
  );
};

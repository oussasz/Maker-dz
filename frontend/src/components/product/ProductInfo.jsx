import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { MdOutlineMoreHoriz } from "react-icons/md";
import ProductRating from "../../components/StarRating/ProductRating";

const ProductInfo = ({ productDetails, averageRating, ratingNumber, onRate, productId, onBuyNowClick }) => {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  return (
    <div className="info-container">
      <h1>{productDetails.name}</h1>
      <div className="actions">
        <div className="stars">
          {averageRating != null && (
            <ProductRating
              productId={productId}
              initialRating={averageRating} // Pass initial rating from state
              onRate={onRate}
            />
          )}{" "}
          ({ratingNumber}){" "}
        </div>

        <div className="share-more">
          <div className="btn">
            <PiPaperPlaneTiltBold />
          </div>
          <button
            className={liked ? "like1 liked1" : "like1"}
            onClick={handleLikeClick}
          >
            <div className="inside">
              <FaHeart color={liked ? "red" : "white"} />
            </div>
          </button>
          <div className="btn">
            <MdOutlineMoreHoriz />
          </div>
        </div>
      </div>
      <div className="description">
        <p>{productDetails.description}</p>
      </div>
      <div className="price">
        <div className="inside">
          <span>Price:</span>
          <span>{productDetails.price} DZD</span>
        </div>
      </div>
      <button className="buy-btn" onClick={onBuyNowClick}>
        <div className="inside">
          <FaBagShopping />
          Buy now
        </div>
      </button>
    </div>
  );
};

export default ProductInfo;

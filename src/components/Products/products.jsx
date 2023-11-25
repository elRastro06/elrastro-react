import { useState, useEffect } from "react";
import axios from "axios";

import "../../assets/styles/products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);
  const [filter, setFilter] = useState(""); // New state for filtering

  useEffect(() => {
    axios
      .get("http://localhost:5001/v1/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5002/v1/")
      .then((response) => {
        setBids(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getHighestBid = (productId) => {
    const vals = bids
      .filter((bid) => bid.productId === productId)
      .map((bid) => bid.amount);
    if (vals.length === 0) {
      return 0;
    }
    return Math.max(...vals); // Spread operator to get the maximum value
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1 className="products-title">El Rastro</h1>

      <div className="products-filter">
        <input
          className="products-filter-input"
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="products">
        {filteredProducts.map((product) => {
          const bid = getHighestBid(product._id);

          return (
            <div className="product" key={product._id}>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <h3 className="product-price">
                  Original price: {product.price}€
                </h3>
                <p className="product-description">{product.description}</p>
              </div>
              {product.images ? (
                <div className="product-image">
                  <img src={product.images[0].url} alt={product.name} />
                </div>
              ) : (
                <div className="product-image">
                  <img src="no_image.png" alt="No image available" />
                </div>
              )}
              <div className="product-bids">
                <p>Highest Bid: {bid !== 0 ? `${bid}€` : "No bids yet"}</p>
                <button className="product-bid-button">Place a bid</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

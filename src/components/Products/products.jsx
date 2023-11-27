import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/products.css";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentFilteredProducts, setCurrentFilteredProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/v1/")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5001/v1/")
      .then((response) => {
        setProducts(response.data);
        setCurrentFilteredProducts(response.data);
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

  const getUser = (productId) => {
    return clients.find(
      (cliente) =>
        products.find((product) => product._id === productId).userID ===
        cliente._id
    );
  };

  return (
    <div>
      <h1 className="products-title">El Rastro</h1>

      <div className="products-filter">
        <input
          className="products-filter-input"
          type="text"
          placeholder="Buscar producto..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setCurrentFilteredProducts(filteredProducts);
            }
          }}
        />
        <span
          className="material-icons"
          onClick={() => {
            setCurrentFilteredProducts(filteredProducts);
          }}
        >
          search
        </span>
      </div>

      <div className="products">
        {currentFilteredProducts.map((product) => {
          const bid = getHighestBid(product._id);
          const user = getUser(product._id);

          return (
            <div className="product" key={product._id}>
              <div
                className="product-user"
                onClick={() => {
                  navigate("/profile/" + user._id);
                }}
              >
                <img src="user.jpg"></img>
                <p className="product-user-name">{user.name}</p>
              </div>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
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
                <p className="product-price">
                  Precio original: {product.price}€
                </p>
                <p className="product-bid-highest">
                  Puja más alta: {bid !== 0 ? `${bid}€` : "Sin pujas todavia"}
                </p>
              </div>
              <div className="product-buttons">
                <button
                  className="product-button"
                  onClick={() => {
                    navigate("/product/" + product._id);
                  }}
                >
                  Ver producto
                </button>
                <button className="product-bid-button">Pujar</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

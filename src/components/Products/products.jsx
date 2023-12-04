import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map from "../Map/map";

import "../../assets/styles/products.css";

export default function Products() {
  const navigate = useNavigate();
  const defaultPosition = [36.602274, -4.531727];

  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);
  const [clients, setClients] = useState([]);
  const [productName, setProductName] = useState("");
  const [radius, setRadius] = useState(25);
  const [updateProduct, setUpdateProduct] = useState(false);
  const [loading, setLoading] = useState(true);

  const getProductsFromAPI = async () => {
    try {
      const productsResponse = await axios.get(
        `http://localhost:5001/v2/?lat=${defaultPosition[0]}&long=${defaultPosition[1]}&radius=${radius}&name=${productName}`
      );
      setProducts(productsResponse.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getClientsFromAPI = async () => {
    try {
      const clientsResponse = await axios.get(
        `http://localhost:5000/v1/?lat=${defaultPosition[0]}&long=${defaultPosition[1]}&radius=${radius}`
      );
      setClients(clientsResponse.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const getBidsFromAPI = async () => {
    try {
      const bidsResponse = await axios.get("http://localhost:5002/v1/");
      setBids(bidsResponse.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (defaultPosition) {
          await getClientsFromAPI();
          await getProductsFromAPI();
          await getBidsFromAPI();
        }
      } catch (error) {
        setLoading(false);
        console.error("Error in useEffect:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateProduct]);

  const getHighestBid = (productId) => {
    const vals = bids
      .filter((bid) => bid.productId === productId)
      .map((bid) => bid.amount);
    if (vals.length === 0) {
      return 0;
    }
    return Math.max(...vals); // Spread operator to get the maximum value
  };

  const getUser = (productId) => {
    return clients.find(
      (cliente) =>
        products.find((product) => product._id === productId).userID ===
        cliente._id
    );
  };

  return (
    <>
      <div>
        <h1 className="products-title">El Rastro</h1>

        <div className="products-filter">
          <input
            className="products-filter-input"
            type="text"
            placeholder="Buscar producto..."
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setUpdateProduct(!updateProduct);
              }
            }}
          />
          <select
            name="radius"
            id="radius"
            className="products-filter-radius"
            onChange={(e) => {
              setRadius(e.target.value);
            }}
            defaultValue={radius}
          >
            <option value="10">10km</option>
            <option value="25">25km</option>
            <option value="50">50km</option>
          </select>
          <span
            className="material-icons"
            onClick={() => {
              setUpdateProduct(!updateProduct);
            }}
          >
            search
          </span>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <div className="products-map-div">
              <Map
                className="products-map"
                radius={radius}
                update={updateProduct}
                products={products}
                clients={clients}
              />
            </div>

            <div className="products">
              {products.map((product) => {
                const user = getUser(product._id);
                const bid = getHighestBid(product._id);

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
                      <p className="product-description">
                        {product.description}
                      </p>
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
                        Puja más alta:{" "}
                        {bid !== 0 ? `${bid}€` : "Sin pujas todavia"}
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
          </>
        )}
      </div>
    </>
  );
}

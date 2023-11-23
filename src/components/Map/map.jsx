import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/map.css";

const Map = () => {
  const defaultPosition = [36.602274, -4.531727];

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPosicionesClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/v1");
      setClientes(res.data);
    } catch (error) {
      console.error("Error fetching client positions:", error);
    }
  };

  const getProducts = async (user) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5001/v1?userID=${user._id}`
      );
      setClientes((prevClientes) =>
        prevClientes.map((prevUser) =>
          prevUser.id === user.id
            ? { ...prevUser, products: res.data }
            : prevUser
        )
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleMarkerClick = (user) => {
    getProducts(user);
  };

  useEffect(() => {
    getPosicionesClientes();
  }, []);

  return (
    <div>
      <style>
        {`
          .popup-container {
            border: 1px solid black;
            border-radius: 9px;
            overflow: hidden;
            padding: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
          }

          .carousel-container {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 3px solid lightblue;
          }

          .product-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center; /* Added to center text horizontally */
          }

          .product-image {
            width: 100%;
            height: 250px;
          }
        `}
      </style>

      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {clientes.map((cliente) => (
          <Marker
            key={cliente.id}
            position={[cliente.lat, cliente.long]}
            eventHandlers={{
              click: () => {
                handleMarkerClick(cliente);
              },
            }}
          >
            <Popup>
              <div className="popup-container">
                <h2>{cliente.name}</h2>
                <h3>{cliente.email}</h3>
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="carousel-container">
                    {cliente.products && cliente.products.length > 0 ? (
                      <Carousel>
                        {cliente.products.map((product) => (
                          <Carousel.Item key={product._id}>
                            <div className="product-info">
                              <a href={`/products/${product._id}`}>
                                <h3>{product.name}</h3>
                                <img
                                  className="product-image"
                                  src={
                                    product.images
                                      ? product.images[0].url
                                      : "https://via.placeholder.com/150"
                                  }
                                  alt="Product Slide"
                                />
                                <p>Descripción: {product.description}</p>
                                <p>Precio: {product.price}</p>
                                <p>Fecha: {product.date}</p>
                              </a>
                            </div>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : (
                      <p>No products</p>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;

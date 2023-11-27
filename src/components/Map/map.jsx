import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/map.css";

const Map = () => {
  // TODO (when login implemented) : get the user's location and set it as the default position
  const defaultPosition = [36.602274, -4.531727];

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // simple get request to get the clients
  const getPosicionesClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/v1");
      setClientes(res.data);
    } catch (error) {
      console.error("Error fetching client positions:", error);
    }
  };

  // get the products of the clicked client and update the state
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
      {/* Map itself */}
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
          // each client has a marker on the map
          <Marker
            key={cliente.id}
            position={[cliente.lat, cliente.long]}
            // when the marker is clicked, the products of the client are fetched from the API
            eventHandlers={{
              click: () => {
                handleMarkerClick(cliente);
              },
            }}
          >
            <Popup>
              <div className="popup-container">
                <div class="container">
                  <div class="user-profile">
                    <h1 class="user-name">{cliente.name}</h1>
                    <p class="user-email">{cliente.email}</p>
                  </div>
                </div>
                {/* // if the products are still loading, show a loading message */}
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="carousel-container">
                    {cliente.products && cliente.products.length > 0 ? (
                      // if the client has products, show them in a carousel
                      <Carousel>
                        {cliente.products.map((product) => (
                          // each product is a slide in the carousel
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
                                  alt="Product Image"
                                />
                              </a>
                              <p>
                                <strong>Descripción:</strong>{" "}
                                {product.description}
                                <br></br>
                                <strong>Precio:</strong> {product.price}
                                <br></br>
                                <strong>Fecha:</strong>{" "}
                                {new Date(product.date).toLocaleDateString()}
                                <br></br>
                              </p>
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/map.css";

const Map = ({ productName }) => {
  // TODO (when login implemented) : get the user's location and set it as the default position
  const defaultPosition = [36.602274, -4.531727];

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(50);
  const [product, setProduct] = useState(productName ? productName : "");

  // simple get request to get the clients and products
  const getPosicionesClientes = async () => {
    try {
      let res = null;
      if (product) {
        res = await axios.get(
          `http://localhost:5000/v1?lat=${defaultPosition[0]}&long=${defaultPosition[1]}&radius=${radius}&product=${product}`
        );
      } else {
        res = await axios.get(
          `http://localhost:5000/v1?lat=${defaultPosition[0]}&long=${defaultPosition[1]}&radius=${radius}`
        );
      }
      if (res.data.length === 0) {
        alert("No se han encontrado clientes en esa zona");
      }
      setClientes(res.data);
    } catch (error) {
      console.error("Error fetching client positions:", error);
    }
  };

  const searchByProduct = async () => {
    try {
      // get the clientes giving a latitud, longitud and radius
      const res = await axios.get(
        `http://localhost:5000/v1?lat=${defaultPosition[0]}&long=${defaultPosition[1]}&radius=${radius}&product=${product}`
      );
      if (res.data.length === 0) {
        alert("No se han encontrado productos con ese nombre");
      }
      // const res = await axios.get("http://localhost:5000/v1");
      setClientes(res.data);
    } catch (error) {
      console.error("Error fetching client positions:", error);
    }
  };

  // get the products of the clicked client and update the state
  const getProducts = async (user) => {
    try {
      let res = null;
      setLoading(true);
      if (product) {
        res = await axios.get(
          `http://localhost:5001/v1?userID=${user._id}&name=${product}`
        );
      } else {
        res = await axios.get(`http://localhost:5001/v1?userID=${user._id}`);
      }
      const newClientes = clientes.map((prevUser) =>
        prevUser.id === user.id ? { ...prevUser, products: res.data } : prevUser
      );
      setClientes(newClientes);
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
  }, [radius]);

  return (
    <div>
      <div className="radius-selector">
        <label htmlFor="radius">Radius:</label>
        <select
          name="radius"
          id="radius"
          onChange={(e) => {
            setRadius(e.target.value);
          }}
        >
          <option value="1">1km</option>
          <option value="10">10km</option>
          <option selected="selected" value="50">
            50km
          </option>
          <option value="100">100km</option>
        </select>
      </div>
      <div className="product-selector">
        <label htmlFor="product">Product Name:</label>
        <input
          type="text"
          name="product"
          id="product"
          onChange={(e) => {
            setProduct(e.target.value);
          }}
          value={product}
        ></input>
        <button
          onClick={() => {
            searchByProduct();
          }}
        >
          Search
        </button>
      </div>
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
            position={[
              cliente.location.coordinates[1],
              cliente.location.coordinates[0],
            ]}
            // when the marker is clicked, the products of the client are fetched from the API
            eventHandlers={{
              click: () => {
                handleMarkerClick(cliente);
              },
            }}
          >
            <Popup>
              <div className="popup-container">
                <div className="container">
                  <div className="user-profile">
                    <h1 className="user-name">{cliente.name}</h1>
                    <p className="user-email">{cliente.email}</p>
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
                            <div className="map-product-info">
                              <a href={`/product/${product._id}`}>
                                <h3>{product.name}</h3>
                                <img
                                  className="map-product-image"
                                  src={
                                    product.images
                                      ? product.images[0].url
                                      : "no_image.png"
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

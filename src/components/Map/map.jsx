import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import CarouselCaption from "react-bootstrap/esm/CarouselCaption";

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
      setClientes((prevClientes) => {
        return prevClientes.map((prevUser) =>
          prevUser.id === user.id
            ? { ...prevUser, products: res.data }
            : prevUser
        );
      });
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
      <h1>Map</h1>
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
              <div>
                <div
                  style={{
                    borderWidth: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                    borderRadius: 9,
                    overflow: "hidden",
                    padding: 5,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <h2>{cliente.name}</h2>
                  <h3>{cliente.email}</h3>
                </div>
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <div>
                    <Carousel>
                      {cliente.products ? (
                        cliente.products.map((product) => (
                          <Carousel.Item key={product._id}>
                            <div>
                              <a href={"/products/" + product._id}>
                                <img
                                  className="d-block w-100"
                                  src={
                                    product.images
                                      ? product.images[0].url
                                      : "https://via.placeholder.com/150"
                                  }
                                  alt="Product Slide"
                                  width={100}
                                  height={250}
                                />
                                <h3>{product.name}</h3>
                                <p>Descripción: {product.description}</p>
                                <p>Precio: {product.price}</p>
                                <p>Fecha: {product.date}</p>
                              </a>
                            </div>
                          </Carousel.Item>
                        ))
                      ) : (
                        <p>No products</p>
                      )}
                    </Carousel>
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

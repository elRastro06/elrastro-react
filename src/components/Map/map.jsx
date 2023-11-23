import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
                <h2>{cliente.name}</h2>
                <h3>{cliente.email}</h3>
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <ul>
                    {cliente.products ? (
                      cliente.products.map((product) => (
                        <li key={product._id}>
                          <a href={"/products/" + product._id}>
                            {product.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <p>No products</p>
                    )}
                  </ul>
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

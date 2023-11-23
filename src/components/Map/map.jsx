import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

// import "../../assets/css/Map.css";

const Map = () => {
  const defaultPosition = [36.602274, -4.531727];

  const [clientes, setClientes] = useState([]);

  const getPosicionesClientes = async () => {
    const res = await axios.get("http://localhost:5000/v1");
    console.log(res.data);
    setClientes(res.data);
  };

  useEffect(() => {
    console.log("Hago useEffect");
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
          <Marker position={[cliente.lat, cliente.lng]}>
            <Popup>
              <div>
                <h2>{cliente.name}</h2>
                <h3>{cliente.email}</h3>
              </div>
            </Popup>
          </Marker>
        ))  
        }
      </MapContainer>
    </div>
  );
};

export default Map;

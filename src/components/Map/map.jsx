import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/map.css";

const Map = (props) => {
  // TODO (when login implemented) : get the user's location and set it as the default position
  const defaultPosition = [36.602274, -4.531727];

  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(props.radius ? props.radius : 25);
  const [clientsWithProducts, setClientsWithProducts] = useState([]);

  useEffect(() => {
    setRadius(props.radius);
    const clientsWithProducts = props.clients.map((client) => ({
      ...client,
      products: props.products.filter(
        (product) => product.userID === client._id
      ),
    }));

    setClientsWithProducts(clientsWithProducts);
  }, [props.products]);

  return (
    <div className={props.className}>
      <div style={{ height: "100%", width: "100%", border: "solid 1px black" }}>
        <MapContainer
          center={defaultPosition}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Circle center={defaultPosition} radius={radius * 1000} />
          {clientsWithProducts.map(
            (cliente) =>
              cliente.products &&
              cliente.products.length > 0 && (
                // each client has a marker on the map
                <Marker
                  key={cliente._id}
                  position={[
                    cliente.location.coordinates[1],
                    cliente.location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="popup-container">
                      {loading ? (
                        <p>Loading products...</p>
                      ) : (
                        <div className="carousel-container">
                          {cliente.products.length === 1 ? (
                            // Render just the single product without Carousel
                            <div className="map-product-info">
                              <a href={`/product/${cliente.products[0]._id}`}>
                                <h5>{cliente.products[0].name}</h5>
                                <img
                                  className="map-product-image"
                                  src={
                                    cliente.products[0].images
                                      ? cliente.products[0].images[0].url
                                      : "no_image.png"
                                  }
                                  alt="Product Image"
                                />
                              </a>
                              <p>
                                <strong>Descr:</strong>{" "}
                                {cliente.products[0].description.slice(0,20)+"..."}
                                <br></br>
                                <strong>Price:</strong>{" "}
                                {cliente.products[0].price}
                                <br></br>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  cliente.products[0].date
                                ).toLocaleDateString()}
                                <br></br>
                              </p>
                            </div>
                          ) : (
                            // Render Carousel for multiple products
                            <Carousel>
                              {cliente.products.map((product) => (
                                <Carousel.Item key={product._id}>
                                  <div className="map-product-carousel-info">
                                    <a href={`/product/${product._id}`}>
                                      <h5>{product.name}</h5>
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
                                      <strong>Description:</strong>{" "}
                                      {product.description}
                                      <br></br>
                                      <strong>Price:</strong> {product.price}
                                      <br></br>
                                      <strong>Date:</strong>{" "}
                                      {new Date(
                                        product.date
                                      ).toLocaleDateString()}
                                      <br></br>
                                    </p>
                                  </div>
                                </Carousel.Item>
                              ))}
                            </Carousel>
                          )}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;

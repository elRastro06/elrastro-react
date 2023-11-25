import { useState, useEffect } from "react";
import axios from "axios";

import "../../assets/styles/products.css";

export default function Products() {
  const [products, setProducts] = useState([]);

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

  return (
    <div>
      <h1>Products</h1>

      <div className="products">
        {products.map((product) => (
          <div className="product" key={product._id}>
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <h3 className="product-price">{product.price}€</h3>
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
          </div>
        ))}
      </div>
    </div>
  );
}

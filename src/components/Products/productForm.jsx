import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/productForm.css";
import productServices from "../../services/productServices";
import bidServices from "../../services/bidServices";
import loginServices from "../../services/loginServices";

export default function NewProductForm({ userLogged }) {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0.0,
    length: 1,
  });

  let productId = useParams().id;

  useEffect(() => {
    if (userLogged == undefined) {
      alert("Login needed. Please login and try again");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const bids = await bidServices.getBids(productId, userLogged.oauthToken);
      if (bids.length > 0) {
        navigate(`/product/${productId}`);
        return;
      }

      const productData = await productServices.getProduct(
        productId,
        userLogged.oauthToken
      );
      if (productData.images != undefined) setImages(productData.images);
      if (productData._id == undefined) {
        navigate("/");
        return;
      } else if (productData.userID != userLogged._id) {
        navigate(`/product/${productId}`);
        return;
      } else {
        setProduct(productData);
      }

      setLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const setName = (event) => {
    const newName = {
      ...product,
      name: event.target.value,
    };
    setProduct(newName);
  };

  const setDescription = (event) => {
    const newDesc = {
      ...product,
      description: event.target.value,
    };
    setProduct(newDesc);
  };

  const setPrice = (event) => {
    const newPrice = {
      ...product,
      price: parseFloat(event.target.value),
    };
    setProduct(newPrice);
  };

  const setLength = (event) => {
    const newLength = {
      ...product,
      length: parseInt(event.target.value),
    };
    setProduct(newLength);
  };

  const handleUploadImage = async (event) => {
    setLoading(true);
    const image = await productServices.addImage(
      productId,
      event.target.files[0],
      userLogged.oauthToken
    );
    setLoading(false);

    setNewImages([...newImages, image]);
  };

  const handleDeleteImage = async (image) => {
    setLoading(true);
    await productServices.deleteImage(image.public_id, userLogged.oauthToken);
    setImages(images.filter((img) => image.public_id != img.public_id));
    setLoading(false);
  };

  const handleDeleteNewImage = async (image) => {
    setLoading(true);
    await productServices.deleteImage(image.public_id, userLogged.oauthToken);
    setNewImages(newImages.filter((img) => image.public_id != img.public_id));
    setLoading(false);
  };

  const handleCancel = async () => {
    newImages.forEach(async (image) => {
      await productServices.deleteImage(image.public_id, userLogged.oauthToken);
    });
    const productData = await productServices.getProduct(
      productId,
      userLogged.oauthToken
    );

    if (productData.name == "") {
      productServices.deleteProduct(productId, userLogged.oauthToken);
    }
    navigate(`/`);
  };

  const handleSave = async () => {
    const body = {
      name: product.name,
      description: product.description,
      price: product.price,
      length: product.length,
      userID: userLogged._id,
      date: new Date(),
    };

    if (images.length != 0 || newImages.length != 0)
      body.images = [...images, ...newImages];

    let response;
    if (productId == undefined) {
      response = await productServices.createProduct(
        body,
        userLogged.oauthToken
      );
      productId = response.insertedId;
    } else {
      response = await productServices.modifyProduct(
        productId,
        body,
        userLogged.oauthToken
      );
    }

    if (response.error != undefined) {
      if (confirm(response.error)) {
        handleCancel();
      }
    } else {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <>
      <div className="editproduct-container">
        <div className="product-images-table">
          <div className="editproduct-input-file">
            <button
              onClick={() => document.getElementById("input-file").click()}
            >
              <span className="material-icons">add</span>Add new image
            </button>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              id="input-file"
              onChange={handleUploadImage}
              hidden
            />
          </div>

          <table className="editproduct-table">
            <thead>
              {/* merge the two columns into one */}

              <tr>
                <th colSpan={2}>Images</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="loading-spinner-editproduct"></td>
                </tr>
              ) : (
                images.map((image) => {
                  return (
                    <tr key={image.public_id}>
                      <td className="action-buttons">
                        <button onClick={() => handleDeleteImage(image)}>
                          <i className="material-icons">delete</i>
                        </button>
                      </td>
                      <td className="editproduct-image-container">
                        <img
                          className="editproduct-image"
                          src={image.secure_url}
                          alt="Producto"
                        ></img>
                      </td>
                    </tr>
                  );
                })
              )}
              {loading
                ? ""
                : newImages.map((image) => {
                    return (
                      <tr key={image.public_id}>
                        <td className="action-buttons">
                          <button onClick={() => handleDeleteNewImage(image)}>
                            <i className="material-icons">delete</i>
                          </button>
                        </td>
                        <td className="editproduct-image-container">
                          <img
                            className="editproduct-image"
                            src={image.secure_url}
                            alt="Producto"
                          ></img>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        <div className="productedit-form-container">
          <form>
            <label>Name: </label>
            <input type="text" value={product.name} onChange={setName}></input>
            <br />
            <label>Description: </label>
            <textarea
              value={product.description}
              onChange={setDescription}
            ></textarea>
            <br />
            <label>Price:</label>
            <input
              type="number"
              step={0.1}
              value={product.price}
              onChange={setPrice}
            ></input>
            <br />
            <label>Length of the bid:</label>
            <select onChange={setLength} value={product.length}>
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </form>
        </div>
      </div>
      <div className="editproduct-finalbuttons">
        <button id="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button id="accept-button" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </>
  );
}

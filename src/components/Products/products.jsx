import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map from "../Map/map";
import loginServices from "../../services/loginServices";
import "../../assets/styles/products.css";


import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';



export default function Products({ userLogged }) {
    const navigate = useNavigate();

    let userPosition = [36.602274, -4.531727];
    if(userLogged != undefined) {
        userPosition = [userLogged.location.coordinates[1], userLogged.location.coordinates[0]];
    }
    
    

    const [price, setPrice] = useState([0, 0]);


    const [minmaxPrice, setMinMaxPrice] = useState([0, 0]);
    const [products, setProducts] = useState([]);
    const [bids, setBids] = useState([]);
    const [clients, setClients] = useState([]);
    const [productName, setProductName] = useState("");
    const [radius, setRadius] = useState(25);
    const [bidsFilter, setBidsFilter] = useState("active");
    const [updateProduct, setUpdateProduct] = useState(false);
    const [loading, setLoading] = useState(true);

    const productsConn = import.meta.env.VITE_PRODUCTS_URL;
    const clientsConn = import.meta.env.VITE_CLIENTS_URL;
    const pujasConn = import.meta.env.VITE_BIDS_URL;

    const getProductsFromAPI = async () => {
        try {
            const productsResponse = await axios.get(
                `${productsConn}/v2/?lat=${userPosition[0]}&long=${userPosition[1]}&radius=${radius}&name=${productName}&description=${productName}`
            );

            loginServices.checkResponse(productsResponse.data);

            // get the highest bid/initial price for each product
            if(price[0] === 0 && price[1] === 0){
                productsResponse.data.forEach((product) => {
                    let highestProdPrice = product.price;
                    
                    if (minmaxPrice[1] < highestProdPrice) {
                        setMinMaxPrice([0, highestProdPrice]);

                    }
    
                });
                setPrice(minmaxPrice);
            }


            // Filtrar por pujas activas o finalizadas
            var filteredProducts = productsResponse.data.filter((product) => {
                const limitDate = new Date(product.date);
                limitDate.setDate(limitDate.getDate() + product.length);
                if (product.name === "" || product.length === undefined) {
                    return false;
                } else if (bidsFilter === "active") {
                    return limitDate > new Date();
                } else if (bidsFilter === "finished") {
                    return limitDate <= new Date();
                }

                else {
                    return true;
                }
            })

            // Filtrar por precio
            filteredProducts = filteredProducts.filter((product) => {
                if (price[0] === price[1] || price[1] === 0) {
                    return true;
                } else if (product.price >= price[0] && product.price <= price[1]) {
                    return true;
                }else{
                    return false;
                }
            }

            )



            setProducts(filteredProducts);

        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const getClientsFromAPI = async () => {
        try {
            const clientsResponse = await axios.get(
                `${clientsConn}/v1/?lat=${userPosition[0]}&long=${userPosition[1]}&radius=${radius}`
            );
            setClients(clientsResponse.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const getBidsFromAPI = async () => {
        try {
            const bidsResponse = await axios.get(`${pujasConn}/v1/`);
            setBids(bidsResponse.data);
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (userPosition) {
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

    const handleChange = (event, newValue) => {
        setPrice(newValue);
    };

    return (
        <>
            <div>
                <div className="products-filter">
                    <input
                        className="products-filter-input"
                        type="text"
                        placeholder="Search product ..."
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
                        name="bids-type"
                        id="bids-type"
                        className="products-filter-bids-type"
                        onChange={(e) => {
                            setBidsFilter(e.target.value);
                        }}
                        defaultValue={bidsFilter}
                    >
                        <option value="active">Active auctions</option>
                        <option value="finished">Closed auctions</option>
                        <option value="all">All auctions</option>
                    </select>
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
                        className="material-icons span-search"
                        id="search-icon"
                        onClick={() => {
                            setUpdateProduct(!updateProduct);
                        }}
                    >
                        search
                    </span>

                    <div className="price-filter">
                        <p>Price range</p>
                        <p>{price[0]}€ - {price[1]}€</p>
                    </div>


                    <div className="slider-container">
                        <Box sx={{ width: 300 }}>
                            <Slider
                                value={price}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                min={minmaxPrice[0]}
                                max={minmaxPrice[1]}
                            />
                        </Box>
                    </div>

                </div>


                {/* Filtro para el precio con un slider donde se pueda elegir el precio máximo y mínimo de los productos que se quieren ver. */}




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
                                userPosition={userPosition}
                            />
                        </div>

                        <div className="products">
                            {products.map((product) => {
                                const user = getUser(product._id);
                                const bid = getHighestBid(product._id);
                                const limitDate = new Date(product.date);
                                limitDate.setDate(limitDate.getDate() + product.length);

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
                                            <p className={"product-price " + (bid !== 0 ? "with-bid" : "")} >
                                                Initial price: {product.price}€
                                            </p>
                                            <p className="product-bid-highest">
                                                Highest bid: {bid !== 0 ? `${bid}€` : "No bids"}
                                            </p>
                                        </div>
                                        <div className="product-date">
                                            {limitDate - new Date() >= 0 ? (
                                                <p className="product-date-limit">
                                                    Remaining auction time:{" "}
                                                    {Math.floor(
                                                        (limitDate - new Date()) / (1000 * 60 * 60 * 24)
                                                    )}{" "}
                                                    days
                                                </p>
                                            ) : (
                                                <p className="product-date-limit">
                                                    The auction is over
                                                </p>
                                            )}
                                        </div>
                                        <div className="product-buttons">
                                            <button
                                                className="product-button"
                                                onClick={() => {
                                                    navigate("/product/" + product._id);
                                                }}
                                            >
                                                Product details
                                            </button>
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

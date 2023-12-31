import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import chatService from "../../services/chatService";
import "../../assets/styles/chats.css";

export default function Chats({ userLogged }) {

    // Todos los chats para no tener que hacer una petición cada vez que se cambia el filtro
    const [allChats, setAllChats] = useState([]);
    // Chats que se muestran en la página
    const [chats, setChats] = useState([]);

    const [filter, setFilter] = useState("buy");

    const navigate = useNavigate();

    useEffect(() => {
        if (userLogged == undefined) {
            alert("Login needed. Please login and try again");
            navigate("/login");
        }
    }, []);

    const handleChatClick = (chatId) => {
        navigate(`/chats/${chatId}`);
    }

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    }

    const formatDate = (timestamp) => {
        // Crear un objeto de fecha a partir de la cadena de fecha
        const fechaObjeto = new Date(timestamp);

        // Verificar si la fecha es válida antes de formatearla
        if (!isNaN(fechaObjeto.getTime())) {
            // Formatear la fecha con hora y minutos
            const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return fechaObjeto.toLocaleDateString('en-EN', opciones);
        } else {
            console.error('La cadena de fecha no es válida.');
            return ''; // Puedes devolver una cadena vacía o algún valor predeterminado en caso de error
        }
    };

    const filtrarChats = (allChatsFunct) => {

        // Filtrar los chats según el filtro seleccionado
        var chats;
        if (filter === "buy") {
            chats = allChatsFunct.filter((chat) => chat.seller !== userLogged._id);
        } else if (filter === "sell") {
            chats = allChatsFunct.filter((chat) => chat.seller === userLogged._id);
        }

        // Actualizar el estado con la lista de chats que ahora incluye información del producto
        setChats(chats);
    }



    const fetchData = async () => {
        try {
            // Obtener la lista de chats
            const chatResponse = await chatService.getAllChatsFromUser(userLogged._id, userLogged.oauthToken);

            // Para cada chat, obtener la información del producto y si es comprador obtener la información del vendedor
            const chatsWithProductAndUserInfo = await Promise.all(chatResponse.map(async (chat) => {
                const productInfo = await chatService.getProductPicture(chat.productId, userLogged.oauthToken);

                var userInfo = { "name": "Interested anonymous user" };
                if (chat.seller === userLogged._id) {
                    chat.participants = [];
                    if(chat.messages.length > 0){
                        chat.messages[0].sender = "Interested anonymous user";
                    }
                } else {
                    userInfo = await chatService.getOneClient(productInfo.userID, userLogged.oauthToken);
                }

                return {
                    ...chat,
                    productInfo: productInfo,
                    userInfo: userInfo
                };
            }));

            // Ordenar los chats por fecha de último mensaje
            chatsWithProductAndUserInfo.sort((a, b) => {
                if(a.messages.length === 0) return 1;
                if(b.messages.length === 0) return -1;
                
                const fechaA = new Date(a.messages[0].timestamp);
                const fechaB = new Date(b.messages[0].timestamp);

                return fechaB - fechaA;
            });

            // Guardar todos los chats en el estado
            setAllChats(chatsWithProductAndUserInfo);

            // Filtrar los chats por el filtro seleccionado
            filtrarChats(chatsWithProductAndUserInfo);            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    // Primera carga de la página
    useEffect(() => {
        fetchData();
    }, []);

    // Cada vez que se cambia el filtro
    useEffect(() => {
        filtrarChats(allChats);
    }, [filter]);



    return (
        <>

            <div id="filterContainer">
                <div id="filterChats">
                    <label className={filter === 'buy' ? 'selected' : ''}>
                        Interested in
                        <input
                            type="radio"
                            value="buy"
                            checked={filter === 'buy'}
                            onChange={() => setFilter('buy')}
                        />
                    </label>
                    <label className={filter === 'sell' ? 'selected' : ''}>
                        Sold by you
                        <input
                            type="radio"
                            value="sell"
                            checked={filter === 'sell'}
                            onChange={() => setFilter('sell')}
                        />
                    </label>
                </div>
            </div>

            
            <div id="chats">

                <div className="chats-container" >
                    {chats.map((chat) => (
                        <div key={chat._id} className="chat-table" >

                            <div className="product-info-chats-column" onClick={() => handleProductClick(chat.productInfo._id)}>
                                <div className="product-info-chats">
                                    <p>{chat.productInfo.name}</p>

                                    {(chat.productInfo.images) ? (
                                        <img src={chat.productInfo.images[0].secure_url}></img>
                                    ) : (
                                        <img className="product-img" src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg" alt="No image available" />
                                    )}
                                </div>
                            </div>

                            <div className="chat-details-column" onClick={() => handleChatClick(chat._id)}>
                                <div className="chat-details">
                                    <p> {(filter === "buy") ? `Seller: ${chat.userInfo.name}` : "Interested anonymous user"}  </p>


                                    <br />

                                    {chat.messages.length > 0 && (
                                        <>
                                            <p>
                                                <strong> {chat.messages[0].sender === userLogged._id ? ("You") : ("Seller")}: </strong>
                                                {chat.messages[0].content}
                                            </p>
                                            <p>
                                                {formatDate(chat.messages[0].timestamp)}
                                            </p>

                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </>

    )
}

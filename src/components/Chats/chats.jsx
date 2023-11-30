import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import chatService from "../../services/chatService";
//TODO : importar el servicio de productos cuando este listo
import "../../assets/styles/chats.css";

export default function Chats() {

    const userLogged = "userID1";

    const [chats, setChats] = useState([]);

    const [filter, setFilter] = useState("buy");

    const navigate = useNavigate();

    const handleChatClick = (chatId) => {
        navigate(`/chats/${chatId}`);
    }

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    }

    const formatearFecha = (timestamp) => {
        // Crear un objeto de fecha a partir de la cadena de fecha
        const fechaObjeto = new Date(timestamp);

        // Verificar si la fecha es válida antes de formatearla
        if (!isNaN(fechaObjeto.getTime())) {
            // Formatear la fecha con hora y minutos
            const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return fechaObjeto.toLocaleDateString('es-ES', opciones);
        } else {
            console.error('La cadena de fecha no es válida.');
            return ''; // Puedes devolver una cadena vacía o algún valor predeterminado en caso de error
        }
    };


    const fetchData = async () => {
        try {
            // Obtener la lista de chats
            const chatResponse = await chatService.getAllChatsFromUser(userLogged);

            // Para cada chat, obtener la información del producto
            const chatsWithProductAndUserInfo = await Promise.all(chatResponse.map(async (chat) => {
                const productInfo = await chatService.getProductPicture(chat.productId);
                const userInfo = await chatService.getOneClient(productInfo.userID);

                console.log(userInfo);
                // Agregar la información extra al chat

                return {
                    ...chat,
                    productInfo: productInfo,
                    userInfo: userInfo
                };
            }));

            chatsWithProductAndUserInfo.sort((a, b) => {
                // Convierte las cadenas de fecha a objetos Date
                const fechaA = new Date(a.messages[0].timestamp);
                const fechaB = new Date(b.messages[0].timestamp);

                // Compara las fechas y devuelve el resultado de la comparación
                return fechaB - fechaA;
            });

            var chatsWithProductAndUserInfoFilter;
            if (filter === "buy") {
                chatsWithProductAndUserInfoFilter = chatsWithProductAndUserInfo.filter((chat) => chat.seller !== userLogged);
            } else if (filter === "sell") {
                chatsWithProductAndUserInfoFilter = chatsWithProductAndUserInfo.filter((chat) => chat.seller === userLogged);
            }

            console.log(chatsWithProductAndUserInfo);

            // Actualizar el estado con la lista de chats que ahora incluye información del producto
            setChats(chatsWithProductAndUserInfoFilter);
        } catch (error) {
            console.error('Error al obtener la información del chat:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);


    return (
        <>
            <h1>Chats</h1>



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

                            <div className="product-info-column" onClick={() => handleProductClick(chat.productInfo._id)}>
                                <div className="product-info">
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
                                    <p>Vendedor: {
                                        chat.userInfo.name
                                    }</p>

                                    <br />

                                    {chat.messages.length > 0 && (
                                        <>
                                            <p>
                                                <strong> {chat.messages[0].sender}: </strong>
                                                {chat.messages[0].content}
                                            </p>
                                            <p>
                                                {formatearFecha(chat.messages[0].timestamp)}
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

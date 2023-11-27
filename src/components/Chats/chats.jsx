import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import chatService from "../../services/chatService";
//TODO : importar el servicio de productos cuando este listo
import "../../assets/styles/chats.css";

export default function Chats() {

    const [chats, setChats] = useState([]);
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
            const chatResponse = await chatService.getAllChatsFromUser("userID1");

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
              

            console.log(chatsWithProductAndUserInfo);

            // Actualizar el estado con la lista de chats que ahora incluye información del producto
            setChats(chatsWithProductAndUserInfo);
        } catch (error) {
            console.error('Error al obtener la información del chat:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            <h1>Chats</h1>
            <div id="chats">

                <div className="chats-container" >
                    {chats.map((chat) => (
                        <div key={chat._id} className="chat-table" >

                            <div className="product-info-column" onClick={() => handleProductClick(chat.productInfo._id)}>
                                <div className="product-info">
                                    <p>{chat.productInfo.name}</p>
                                    <img src={chat.productInfo.images[0].secure_url}></img>
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

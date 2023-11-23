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


    const fetchData = async () => {
        try {
            // Obtener la lista de chats
            const chatResponse = await chatService.getAllChatsFromUser("userID1");
            
            // Para cada chat, obtener la información del producto
            const chatsWithProductInfo = await Promise.all(chatResponse.map(async (chat) => {
                const productInfo = await chatService.getProductPicture(chat.productId);
                // Agregar la información del producto al chat

                return {
                    ...chat,
                    productInfo: productInfo,
                };
            }));

            // Actualizar el estado con la lista de chats que ahora incluye información del producto
            setChats(chatsWithProductInfo);
        } catch (error) {
            console.error('Error al obtener la información del chat:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div>
            <h1>Chats</h1>
            
            <div className="chats-container" >
                {chats.map((chat) => (
                    <div key={chat._id} className="chat-table" onClick={() => handleChatClick(chat._id)}>

                        <div className="product-info-column">
                            <div className="product-info">
                                <p>{chat.productInfo.name}</p>
                                <img src={chat.productInfo.images[0].secure_url}></img>
                            </div>
                        </div>

                        <div className="chat-details-column">
                            <div className="chat-details">
                                <p>Vendedor: {chat.productInfo.userID}</p>
                                {/* <p>Último Mensaje: Hola, ¿estás interesado en comprar el producto?</p>
                                <p>Fecha del Último Mensaje: 23 de Noviembre, 2023</p> */}
                                {chat.messages.length > 0 && (
                                    <>
                                        <p>
                                            <strong> {chat.messages[0].sender}: </strong>
                                            {chat.messages[0].content}
                                        </p>
                                        <p>
                                            {chat.messages[0].timestamp}
                                        </p>

                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>









        </div>
    )
}

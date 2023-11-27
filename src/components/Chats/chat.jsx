import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import chatService from "../../services/chatService";

import "../../assets/styles/chat.css";

export default function Chat() {

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 100);
    }


    const chatId = useParams().id;
    const userLogged = "userID1";

    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');
    const [productInfo, setProductInfo] = useState({});
    const [messages, setMessages] = useState([]);

    const handleChatsClick = () => {
        navigate(`/chats`);
    }

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            const newMessageObj = {
                _id: messages.length + 1,
                content: newMessage,
                sender: userLogged,
            };


            try {
                const response = await chatService.sendMessage(chatId, newMessageObj);

                newMessageObj.sender = 'user';
                setMessages([...messages, newMessageObj]);
                setNewMessage('');


            } catch (error) {
                console.error('Error al obtener la información del chat:', error);
            }

        }

        scrollToBottom();

    };

    const fetchData = async () => {
        try {
            // Obtener la lista de mensajes
            const chatResponse = await chatService.getOneChat(chatId);
            const messages = chatResponse.messages;

            // Obtener la información del producto
            const productInfo = await chatService.getProductPicture(chatResponse.productId);
            setProductInfo(productInfo);

            // Para cada mensaje habría que añadir como atributo cual es suyo y cual no
            for (const message of chatResponse.messages) {
                console.log(message.sender + " " + userLogged);
                if (message.sender === userLogged) {
                    message.sender = 'user';
                } else {
                    message.sender = 'other';
                }
            }

            // Actualizar el estado con la lista de chats que ahora incluye información del producto
            setMessages(messages);
        } catch (error) {
            console.error('Error al obtener la información del chat:', error);
        }

        scrollToBottom();


    };

    useEffect(() => {
        fetchData();
        console.log(messages);
    }, []);

    return (
        <>

            <div className="chat-container">
                <div className="chat-header">
                    <span className="material-icons" onClick={handleChatsClick}>
                        arrow_back
                    </span>

                    <span className="chat-name">Nombre del usuario</span>

                    <div className="product-info">
                        <span className="product-name">{productInfo.name}</span>
                        <img className="product-img" src={productInfo.images && productInfo.images[0].secure_url}></img>
                    </div>

                </div>


                <div className="messages-container">
                    {messages.map((message, i) => (
                        <div key={i} className={`message ${message.sender}`}>
                            {message.content}
                            {i === messages.length - 1 ? <div ref={messagesEndRef} /> : null}
                        </div>
                    ))}
                </div>

                <div className="input-container">
                    <textarea className="message-input"
                        placeholder="Escribe tu mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage}>Enviar</button>
                </div>

            </div>



        </>
    );
};

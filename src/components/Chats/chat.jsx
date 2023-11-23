import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import chatService from "../../services/chatService";

import "../../assets/styles/chat.css";

export default function Chat() {
    const chatId = useParams().id;
    const userLogged = "userID1";

    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');

    const handleChatsClick = () => {
        navigate(`/chats`);
    }

    const [messages, setMessages] = useState([]);


    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const newMessageObj = {
                id: messages.length + 1,
                text: newMessage,
                sender: 'user',
            };

            setMessages([...messages, newMessageObj]);
            setNewMessage('');
        }
    };

    const fetchData = async () => {
        try {
            // Obtener la lista de mensajes
            const chatResponse = await chatService.getOneChat(chatId);
            const messages = chatResponse.messages;

            // Para cada mensaje habría que añadir como atributo cual es suyo y cual no
            for (const message of chatResponse.messages) {
                console.log(message.sender + " " + userLogged);
                if(message.sender === userLogged){
                    message.sender = 'user';
                }else{
                    message.sender = 'other';
                }
            }

            // Actualizar el estado con la lista de chats que ahora incluye información del producto
            setMessages(messages);
        } catch (error) {
            console.error('Error al obtener la información del chat:', error);
        }
    };

    useEffect(() => {
        fetchData();
        console.log(messages);
    }, []);

    return (
        <>
            <button id="returnBack" className="back-button" onClick={handleChatsClick}> Chats </button>
            <div className="chat-container">
                <div className="messages-container">
                    {messages.map((message) => (
                        <div key={message._id} className={`message ${message.sender}`}>
                            {message.content}
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

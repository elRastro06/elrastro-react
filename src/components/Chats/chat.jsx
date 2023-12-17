import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import chatService from "../../services/chatService";
import loginServices from "../../services/loginServices";

import "../../assets/styles/chat.css";

export default function Chat({ userLogged }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const chatId = useParams().id;

  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [productInfo, setProductInfo] = useState({});
  const [otherUserInfo, setOtherUserInfo] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userLogged == undefined) {
      alert("Login needed. Please login and try again");
      navigate("/login");
    }
  }, []);

  const handleChatsClick = () => {
    navigate(`/chats`);
  };

  const handleProductClick = () => {
    navigate(`/product/${productInfo._id}`);
  };

  const handleGoDown = () => {
    scrollToBottom();
  };

  const formatearFecha = (timestamp) => {
    // Crear un objeto de fecha a partir de la cadena de fecha
    const fechaObjeto = new Date(timestamp);

    // Verificar si la fecha es válida antes de formatearla
    if (!isNaN(fechaObjeto.getTime())) {
      // Formatear la fecha con hora y minutos
      const opciones = { hour: "numeric", minute: "numeric", hour12: false };
      const horaYMinutos = fechaObjeto.toLocaleTimeString("es-ES", opciones);
      return horaYMinutos;
    } else {
      console.error("La cadena de fecha no es válida.");
      return ""; // Puedes devolver una cadena vacía o algún valor predeterminado en caso de error
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const newMessageObj = {
        _id: messages.length + 1,
        content: newMessage,
        sender: userLogged._id,
        timestamp: new Date(),
      };

      try {
        const response = await chatService.sendMessage(
          chatId,
          newMessageObj,
          userLogged.oauthToken
        );

        newMessageObj.sender = "user";
        setMessages([...messages, newMessageObj]);
        setNewMessage("");

        scrollToBottom();
      } catch (error) {
        console.error("Error al obtener la información del chat:", error);
      }
    }
  };

  const fetchData = async () => {
    try {
      // Obtener la lista de mensajes
      const chatResponse = await chatService.getOneChat(
        chatId,
        userLogged.oauthToken
      );
      const messages = chatResponse.messages;

      // Obtener la información del producto
      const productInfo = await chatService.getProductPicture(
        chatResponse.productId,
        userLogged.oauthToken
      );
      setProductInfo(productInfo);

      if (userLogged._id === chatResponse.seller) {
        // Usuario anónimo interesado en el producto
        setOtherUserInfo({ name: "Interested anonymous user" });
      } else {
        // Obtener la información del otro usuario
        const otherUserInfo = await chatService.getOneClient(
          productInfo.userID,
          userLogged.oauthToken
        );
        setOtherUserInfo(otherUserInfo);
      }

      // Para el estilo, y para conservar anonimato
      for (const message of chatResponse.messages) {
        if (message.sender === userLogged._id) {
          message.sender = "user";
        } else {
          message.sender = "other";
        }
      }

      // Actualizar el estado con la lista de chats que ahora incluye información del producto
      setMessages(messages);
    } catch (error) {
      console.error("Error al obtener la información del chat:", error);
    }

    scrollToBottom();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="chat-container">
        <div className="chat-header">
          <span
            className="material-icons arrow-back"
            onClick={handleChatsClick}
          >
            arrow_back
          </span>

          <span className="chat-name">{otherUserInfo.name}</span>

          <div
            className="product-info-chat"
            onClick={() => handleProductClick()}
          >
            <p className="product-name-chat">{productInfo.name}</p>
            {productInfo.images ? (
              <img
                className="product-img-chat"
                src={productInfo.images && productInfo.images[0].secure_url}
              ></img>
            ) : (
              <img
                className="product-img-chat"
                src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                alt="No image available"
              />
            )}
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message, i) => (
            <div key={i} className={`message ${message.sender}`}>
              {message.content}
              <div className={`timestamp-${message.sender}`}>
                {formatearFecha(message.timestamp)}
              </div>
              {i === messages.length - 1 ? <div ref={messagesEndRef} /> : null}
            </div>
          ))}
        </div>

        <div className="input-container">
          <textarea
            className="message-input"
            placeholder="Write your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <span className="material-icons send" onClick={handleSendMessage}>
            send
          </span>

          <span className="material-icons south" onClick={handleGoDown}>
            south
          </span>
        </div>
      </div>
    </>
  );
}

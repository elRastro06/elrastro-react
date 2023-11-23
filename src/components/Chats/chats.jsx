import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import chatService from "../../services/chatService";


import "../../assets/styles/chats.css";

export default function Chats() {

    const [chats, setChats] = useState([]);

    useEffect(() => {
        chatService.getAllChatsFromUser("userID2").then((response) => {
            setChats(response);
            console.log(response);
        })
    }, []);


    return (
        <div>
            <h1>Chats</h1>

            <div className="chats-container">
                {chats.map((chat) => (
                    <div key={chat._id} className="chat-card">
                        <h3>{chat._id}</h3>
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
                ))}
            </div>



        </div>
    )
}

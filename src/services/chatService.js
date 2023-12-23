import Axios from "axios";
import loginServices from "./loginServices";

const chatsConn = import.meta.env.VITE_CHATS_URL;
const productsConn = import.meta.env.VITE_PRODUCTS_URL;
const clientsConn = import.meta.env.VITE_CLIENTS_URL;

const url_chats = `${chatsConn}/v1/chats`;
const url_chatsV2 = `${chatsConn}/v2/chats`;
const url_chat = `${chatsConn}/v1/chat`;
const url_chatV2 = `${chatsConn}/v2/chat`;
const url_product = `${productsConn}/v1`;
const url_clients = `${clientsConn}/v1`;


const getAllChatsFromUser = async (userId, token) => {
    const response = await Axios.get(url_chats + '/' + userId, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const getChatFromUserAndProduct = async (userId, productId, token) => {
    const response = await Axios.get(url_chatsV2 + '/' + userId + '?productId=' + productId, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const getOneChat = async (chatId, token) => {
    const response = await Axios.get(url_chat + '/' + chatId, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const getProductPicture = async (productId, token) => {
    const response = await Axios.get(url_product + '/' + productId, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const sendMessage = async (chatId, message, token) => {
    const response = await Axios.post(url_chat + '/' + chatId + "/message", message, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const getOneClient = async (clientId, token) => {
    const response = await Axios.get(url_clients + '/' + clientId, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const createNewChat = async (productId, seller, user, token) => {
    const body = {
        productId: productId,
        seller: seller,
        user: user
    };
    const response = await Axios.post(url_chatV2, body, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}


const chatService = { getAllChatsFromUser, getChatFromUserAndProduct, getOneChat, getProductPicture, sendMessage, getOneClient, createNewChat }

export default chatService;
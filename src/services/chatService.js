import Axios from "axios";

const url_chats = 'http://localhost:5007/v1/chats';
const url_chat = 'http://localhost:5007/v1/chat';
const url_product = 'http://localhost:5001/v1';
const url_clients = 'http://localhost:5000/v1';


const getAllChatsFromUser = async (userId) => {
    const response = await Axios.get(url_chats + '/' + userId);
    return response.data;
}

const getOneChat = async (chatId) => {
    const response = await Axios.get(url_chat + '/' + chatId);
    return response.data;
}

const getProductPicture = async (productId) => {
    const response = await Axios.get(url_product + '/' + productId);
    return response.data;
}

const sendMessage = async (chatId, message) => {
    const response = await Axios.post(url_chat + '/' + chatId + "/message", message);
    return response.data;
}

const getOneClient = async (clientId) => {
    console.log(url_clients + '/' + clientId);
    const response = await Axios.get(url_clients + '/' + clientId);
    return response.data;
}


const chatService = { getAllChatsFromUser, getOneChat, getProductPicture, sendMessage, getOneClient  }

export default chatService;
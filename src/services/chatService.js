import Axios from "axios";

const url_chats = 'http://localhost:5007/v1/chats';
const url_chat = 'http://localhost:5007/v1/chat';

const getAllChatsFromUser = async (userId) => {
    const response = await Axios.get(url_chats + '/' + userId);
    return response.data;
}

const getOneChat = async (chatId) => {
    const response = await Axios.get(url_chat + '/' + chatId);
    return response.data;
}


const chatService = { getAllChatsFromUser, getOneChat }

export default chatService;
import {createContext, useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext()

const ChatProvider = (props)=>{
    const [user, setUser] = useState();
    const [SelectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);

    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo);
        if(!userInfo){
            navigate("/");
        }
    },[navigate])
    
    return(
        <ChatContext.Provider value={{user, setSelectedChat, chats, setChats, SelectedChat, notification, setNotification, forgotPass, setForgotPass, loadingChat, setLoadingChat}}>
            {props.children}
        </ChatContext.Provider>
    )
}

export const ChatState = ()=>{
    return useContext(ChatContext)
}

export default ChatProvider;
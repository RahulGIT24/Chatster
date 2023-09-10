import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
const ChatContext = createContext()

const ChatProvider = (props) => {
    const toast  = useToast();
    const [user, setUser] = useState();
    const [SelectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo);
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate])

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(true);
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "ChatApp");
            data.append("cloud_name", "dzyhwodtq");
            fetch("https://api.cloudinary.com/v1_1/dzyhwodtq/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    };


    return (
        <ChatContext.Provider value={{ user, setSelectedChat, chats, setChats, SelectedChat, notification, setNotification, forgotPass, setForgotPass, loadingChat, setLoadingChat, pic, postDetails, picLoading }}>
            {props.children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider;
// Imports
import React, { useEffect, useState } from 'react'
import axios from "axios"

const Chat = () => {
  // By default the state is an empty array
  const [chats, setChats] = useState([]);

  // Hitting api from axios
  const fetchChats = async()=>{
    const {data} = await axios.get('/api/chat')
    setChats(data)
  }

  // Fetching data
  useEffect(()=>{
    fetchChats();
  },[])

  return (
    <div>
      {chats.map((e)=>{
        return <div key={e._id}>
          {e.chatName}
        </div>
      })}
    </div>
  )
}

export default Chat

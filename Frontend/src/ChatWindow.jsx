import './ChatWindow.css'
import Chat from './Chat.jsx'
import { MyContext } from './MyContext.jsx';
import { useContext,useState,useEffect, use } from 'react';
import { ScaleLoader } from 'react-spinners';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;




function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChat,
    setNewChat,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useContext(MyContext); // consuming value from context
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getRelpy = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("Prompt: ", prompt);
    console.log("Current Thread ID: ", currThreadId);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: prompt,
        threadId: currThreadId,
      });

      const res = response.data;

      console.log("Response:", res);

      setReply(res.reply);
    }catch(err) {
      console.error("Error while fetching reply: ", err);
    }
    setLoading(false);
  }

  // Append new chats to previous chats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChat(prevChat => (
        [...prevChat, {
          role: 'user',
          content: prompt
        }, {
          role: 'assistant',
          content: reply
        }]
      ))
    }
    setPrompt('');
  }, [reply])
  

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }


  return (
    <div className="chatWindow">
      <div className="navbar">
        <i
          className="fa-solid fa-bars menuIcon"
          onClick={() => setIsSidebarOpen(true)}
        ></i>
        <span>
          Zeni.AI<i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="uesrIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i class="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropDownItem">
            <i class="fa-solid fa-cloud-arrow-up"></i>Upgrade plan
          </div>
          <div className="dropDownItem">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>Log out
          </div>
        </div>
      )}

      <div className="chatContainer">
        <Chat />
      </div>

      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getRelpy() : "")}
          ></input>
          <div id="submit" onClick={getRelpy}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          Zeni.AI can make mistakes. Check important info. See cookie Preference
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
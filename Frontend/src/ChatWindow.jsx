import './ChatWindow.css'
import Chat from './Chat.jsx'
import { MyContext } from './MyContext.jsx';
import { useContext,useState,useEffect, use } from 'react';
import {ScaleLoader} from 'react-spinners';


function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChat, setNewChat} = useContext(MyContext); // consuming value from context
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getRelpy = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("Prompt: ", prompt);
    console.log("Current Thread ID: ", currThreadId);


    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        message: prompt,
        threadId: currThreadId
      })
    };
    try {
      const response = await fetch('http://localhost:5000/api/chat', option);
      const res=await response.json();
      console.log("Response: ", res);
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

    <div className='chatWindow'>
      <div className="navbar">
        <span>Zeni.AI<i className="fa-solid fa-chevron-down"></i></span>
        <div className="uesrIconDiv" onClick={handleProfileClick}>
          <span className='userIcon'><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {
        isOpen && 
        <div className="dropDown">
            <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
            <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade plan</div>
            <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i>Log out</div>
        </div>
      }

      <Chat></Chat>

      <ScaleLoader color='#fff' loading={loading}>

      </ScaleLoader>

      <div className="chatInput">

        <div className="inputBox">
          <input placeholder='Ask anything'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? getRelpy():''}
          >
            
          </input>
          <div id='submit' onClick={getRelpy}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        
        <p className='info'>
          Zeni.AI can make mistakes. Check important info. See cookie Preference
        </p>
        
      </div>
    </div>
  )
}

export default ChatWindow;
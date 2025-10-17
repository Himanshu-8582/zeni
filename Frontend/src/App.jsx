import './App.css'
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';


function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1()); // state to hold current thread id
  const [prevChat, setPrevChat] = useState([]); // state to hold previous chat of current thread threads
  const [newChat, setNewChat] = useState(true); // state to indicate if new chat is started
  const [allThreads,setAllThreads] = useState([]); // state to hold all threads

  const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChat, setPrevChat,
    allThreads, setAllThreads
  };                                      // passing value to context


  return (
    <div className="app">
      <MyContext.Provider value={providerValue}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App;

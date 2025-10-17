import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext.jsx';
import './Sidebar.css'
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setNewChat, setPrompt, setReply, setPrevChat} = useContext(MyContext); // getting all threads from context
  
  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/thread");
      const res = await response.json();
      
      const filteredData = res.map(thread => (
        {
          threadId: thread.threadId,
          title : thread.title
        }
      ))
      // console.log(filteredData);
      setAllThreads(filteredData);

    }catch(err) {
      console.error("Error fetching threads:", err);
    }
  }

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]); //
  

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChat([]);
  }

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(`http://localhost:5000/api/thread/${newThreadId}`);
      const res = await response.json();
      console.log(res);
      setPrevChat(res);
      setNewChat(false);
      setReply(null);
    } catch (e) {
      console.log(e);
    }
  }

  const deleteThread = async (threadId)=> {
    try {
      const response = await fetch(`http://localhost:5000/api/delete/${threadId}`, { method: "DELETE" });
      const res = await response.json();
      console.log(res);

      // reRendering updated threads So we dont need to refresh page again
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if (threadId === currThreadId) {
        createNewChat();
      }


    } catch (e) {
      console.log(e);
    }
  }
  
  return (
      <section className="sidebar">
        {/* new Chat Button */}
        <button onClick={createNewChat}>
          <img src="src/assets/blacklogo.png" alt="gpt-logo" className='logo'/>
          <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>


        {/* history */}
        <ul className='history'>
        {
          allThreads?.map((thread,idx) => (
            <li key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId===currThreadId?"highlighted":" "}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();  //Stop event bubbling
                  deleteThread(thread.threadId);
                }}
              >

              </i>
            </li>
          ))
          }
        </ul>

        {/* sign-up */}
        <div className="sign">
          <p>By Himanshu &hearts;</p>
        </div>

      </section>
  )
}

export default Sidebar;


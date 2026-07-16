import './Chat.css';
import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext.jsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { useState } from 'react';

function Chat() {
  const { newChat, prevChat, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState('');

  useEffect(() => {
    if (!reply) {
      setLatestReply(null);
      return;
    }

    const words = reply.split(" ");

    let index = 0;

    const timer = setInterval(() => {
      setLatestReply(words.slice(0, index + 1).join(" "));

      index++;

      if (index >= words.length) {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [reply]);

  return (
    <>
      
      {newChat && <h1>Start a new Chat!</h1>}
      <div className='chats'>
        {
         prevChat ?.slice(0,-1).map((chat, index) =>
           <div className={chat.role === "user" ? 'userDiv' : 'gptDiv'} key={index}>
             {
               chat.role === "user" ?
                 <p className='userMessage'>{chat.content}</p> :
               // <p className='gptMessage'>{chat.content}</p>
                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
             }
           </div>
         )
        }

        {
          prevChat.length > 0 && latestReply !== null &&
          <div className='gptDiv' key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
          </div>
        }

        {
          prevChat.length > 0 && latestReply === null &&
          <div className='gptDiv' key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChat[prevChat.length-1].content}</ReactMarkdown>
          </div>
        }

      </div>
    </>
  )
}

export default Chat;
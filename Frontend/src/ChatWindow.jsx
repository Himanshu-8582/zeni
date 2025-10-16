import './ChatWindow.css'
import Chat from './Chat.jsx'

function ChatWindow() {
  return (

    <div className='chatWindow'>
      <div className="navbar">
        <span>Zeni.AI<i class="fa-solid fa-chevron-down"></i></span>
        <div className="uesrIconDiv">
          <span className='userIcon'><i class="fa-solid fa-user"></i></span>
        </div>
      </div>

      <Chat></Chat>

      <div className="chatInput">

        <div className="inputBox">
          <input placeholder='Ask anything'>
            
          </input>
          <div id='submit'><i class="fa-solid fa-paper-plane"></i></div>
        </div>
        
        <p className='info'>
          Zeni.AI can make mistakes. Check important info. See cookie Preference
        </p>
        
      </div>
    </div>
  )
}

export default ChatWindow;
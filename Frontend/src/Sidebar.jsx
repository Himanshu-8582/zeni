
import './Sidebar.css'
function Sidebar() {
  
  return (
      <section className="sidebar">
        {/* new Chat Button */}
        <button>
          <img src="src/assets/blacklogo.png" alt="gpt-logo" className='logo'/>
          <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>


        {/* history */}
        <ul className='history'>
          <li>Thread1</li>
          <li>Thread2</li>
          <li>Thread3</li>
        </ul>

        {/* sign-up */}
        <div className="sign">
          <p>By Himanshu &hearts;</p>
        </div>

      </section>
  )
}

export default Sidebar;


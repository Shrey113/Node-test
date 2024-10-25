import { React, useState, useEffect } from 'react';
import io from "socket.io-client";
import './css_files/HomePage.css'
import HomePageSubMenu  from './sub_component/HomePageSubMenu'
import app_icon from './Data/web_site_logo.png'
import ChatsForHome from './ChatsForHome';
import CallsForHome from './CallsForHome';


const socket = io("https://test-node-90rz.onrender.com", {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

function HomePage() {
  const [is_dark_mode, set_is_dark_mode] = useState('Dark');
  const toggle_light_and_dark_mode = ()=>{set_is_dark_mode(is_dark_mode=== 'Dark' ? 'Light':'Dark') }
  const [active_page,set_active_page] = useState("Chats")
  const [show_full_menu, set_show_full_menu] = useState(false);

  const [show_sub_pop_menu,set_show_sub_pop_menu] = useState({show_pop:false,pop_data:''});
  

  // Dynamically require images based on `is_dark_mode`
  const line_3 = require(`./Data/Home_page_data/${is_dark_mode}/3_line.png`);
  const chat_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/chat.png`);
  const call_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/telephone.png`);
  const status_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/status.png`);
  const star_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/star.png`);
  const archive_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/archive.png`);
  const setting_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/setting.png`);
  const user_profile_icon = require(`./Data/Home_page_data/${is_dark_mode}/user.png`);

  
  const [user_data_email, set_user_data_email] = useState('');
  const [user_data_user_name, set_user_data_user_name] = useState('');
  const [user_data_password, set_user_data_password] = useState('');

  const localstorage_key_for_jwt_user_side_key = 'Jwt_user_localstorage_key_on_chat_x';
  
  function start_chat_connection_to_server(user_email){

    socket.on("connect", () => {
      console.log("Connected to the server!");
    });
    if(user_email){
      socket.emit("user_info",{user_email})
    }
    
    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }

  useEffect(() => {
    const token = window.localStorage.getItem(localstorage_key_for_jwt_user_side_key);
    if (token) {
      fetch('https://test-node-90rz.onrender.com/get_user_data_from_jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt_token: token }),
      })
      .then((res) => res.json())
      .then((data) => {
        set_user_data_email(data.userData.email);
        set_user_data_user_name(data.userData.username);
        set_user_data_password(data.userData.password);
        start_chat_connection_to_server(data.userData.email);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
      });
    }
  }, []);

  const logout_user = () => {
    window.localStorage.removeItem(localstorage_key_for_jwt_user_side_key);
    window.location.reload();
  };



  return (
    <div id="home_page" className={is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}>
      <div className={`${show_full_menu ? 'side_bar' : 'side_bar inactive'} ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
        <div className="top_part_con">

     
        <div className="app_icon_con">
          <img src={app_icon} alt="" />
          <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Chat X</p>
        </div>

        <div className="menu_item_con" onClick={()=>{set_show_full_menu(!show_full_menu)}}>
          <img src={line_3} alt="menu" />
          <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Menu</p>
        </div>

        <div className={`menu_item_con ${active_page === 'Chats' && 'active'}`} onClick={()=>{set_active_page("Chats");set_show_full_menu(false)}}>
          <img src={chat_menu_icon} alt="" />
          <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Chats</p>
        </div>

        <div className={`menu_item_con ${active_page === 'Calls' && 'active'}`} onClick={()=>{set_active_page("Calls");set_show_full_menu(false)}}>
          <img src={call_menu_icon} alt="" />
          <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Calls</p>
        </div>

        <div className={`menu_item_con ${active_page === 'Status' && 'active'}`} onClick={()=>{set_active_page("Status");set_show_full_menu(false)}}>
          <img src={status_menu_icon} alt="" />
          <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Status</p>
        </div>

        <div className="line_div"></div>
        

        </div>
        <div className="bottom_part_con">
          <div className={`menu_item_con ${active_page === 'Starred messages' && 'active'}`} onClick={()=>{set_active_page("Starred messages");set_show_full_menu(false)}}>
            <img src={star_menu_icon} alt="" />
            <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Starred messages</p>
          </div>
          <div className={`menu_item_con ${active_page === 'Archived chats' && 'active'}`} onClick={()=>{set_active_page("Archived chats");set_show_full_menu(false)}}>
            <img src={archive_menu_icon} alt="" />
            <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Archived chats</p>
          </div>
          <div className="line_div"></div>
          <div className="menu_item_con"
          onClick={()=>{
            set_show_sub_pop_menu({show_pop:true,pop_data:'General'})
          }}
          >
            <img src={setting_menu_icon} alt="" />
            <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Settings</p>
          </div>
          <div className="menu_item_con" 
              onClick={()=>{
                set_show_sub_pop_menu({show_pop:true,pop_data:'Profile'})
              }}
            >
            <img src={user_profile_icon} alt="" />
            <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Profile</p>
          </div>
        </div>



      </div>



    <div className="home_page_full_page">


    {active_page === 'Chats' && 
        <ChatsForHome set_dark_mode={is_dark_mode} 
        user_data_email={user_data_email}  
          user_name={user_data_user_name} 
        />}
    {active_page === 'Calls' && <CallsForHome set_dark_mode={is_dark_mode} />}
    {active_page === 'Status' && <>
      <h2>This is the home page</h2>
<h3>Email: {user_data_email}</h3>
<h3>Username: {user_data_user_name}</h3>
<h3>Password: {user_data_password}</h3>



    </>}
    </div>


    {show_sub_pop_menu.show_pop 
      && <HomePageSubMenu 
          logout_user={logout_user}
          toggle_light_and_dark_mode={toggle_light_and_dark_mode}
          user_all_data={{user_data_email,user_data_user_name,user_data_password}}
          file_close_funtion={()=>{set_show_sub_pop_menu({show_pop:false,pop_data:''})}} 
          set_me_on_open_menu={show_sub_pop_menu.pop_data} 
          dark_mode_stat={is_dark_mode} 
          />
          }
    </div>
  );
}


export default HomePage;


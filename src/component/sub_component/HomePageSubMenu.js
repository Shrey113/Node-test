import {React,useState} from 'react'
import '../css_files/HomePageSubMenu.css'

function HomePageSubMenu({file_close_funtion,dark_mode_stat,set_me_on_open_menu,user_all_data,toggle_light_and_dark_mode,logout_user}) {
    
    const {user_data_email,user_data_user_name,user_data_password} = user_all_data
    
    const [active_page,set_active_page] = useState(`${set_me_on_open_menu ? set_me_on_open_menu : "General" }`)

    const user_profile_icon = require(`../Data/Home_page_data/${dark_mode_stat}/profile_icon.png`);
    
    const personalization_icon = require(`../Data/Home_page_data/${dark_mode_stat}/personalization.png`);
    const technology_icon = require(`../Data/Home_page_data/${dark_mode_stat}/technology.png`);
    const Account_icon = require(`../Data/Home_page_data/${dark_mode_stat}/key.png`);
    const chat_icon = require(`../Data/Home_page_data/${dark_mode_stat}/chat.png`);
    const notification_icon = require(`../Data/Home_page_data/${dark_mode_stat}/notification.png`);
    const Help_icon = require(`../Data/Home_page_data/${dark_mode_stat}/info.png`);


  return (
    
    <div id='HomePageSubMenu' onClick={()=>{file_close_funtion({show_pop:false,pop_data:''})}}>
      
      <div className={`user_sub_menu ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`} onClick={(e)=>{e.stopPropagation()}}>

        <div className="side_menu">

            <div className="top_sub_menu_part">
                <div className={`menu_item_con ${active_page === 'General' && 'active'}`} onClick={()=>{set_active_page("General")}}>
                    <img src={technology_icon} alt="" />
                    <p className="menu_name">General</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Account' && 'active'}`} onClick={()=>{set_active_page("Account")}}>
                    <img src={Account_icon} alt="" />
                    <p className="menu_name">Account</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Chats' && 'active'}`}  onClick={()=>{set_active_page("Chats")}}>
                    <img src={chat_icon} alt="" />
                    <p className="menu_name">Chats</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Notifications' && 'active'}`}  onClick={()=>{set_active_page("Notifications")}}>
                    <img src={notification_icon} alt="" />
                    <p className="menu_name">Notifications</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Personalization' && 'active'}`}  onClick={()=>{set_active_page("Personalization")}}>
                    <img src={personalization_icon} alt="" />
                    <p className="menu_name">Personalization</p>
                </div>
                
                <div className={`menu_item_con ${active_page === 'Help' && 'active'}`}  onClick={()=>{set_active_page("Help")}}>
                    <img src={Help_icon} alt="" />
                    <p className="menu_name">Help</p>
                </div>
            </div>

            <div className="bottom_sub_menu_part">
                {/*  */}
                <div className={`menu_item_con ${active_page === 'Profile' && 'active'}`}  onClick={()=>{set_active_page("Profile")}}>
                    <img src={user_profile_icon} alt="" />
                    <p className="menu_name">Profile</p>
                </div>
            </div>

         

        </div>
        <div className="info_section">
            <div className={`sub_info ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                <div className="info_title">{active_page}</div>
                <div className="info_data">
                    This  features are not avilable for now!<br/>Next version have a this  features
                    <br />
                    <br />
                    <br />
                    <h2>Test data :</h2>
                    <br />

                    <p>Email: {user_data_email}</p>
                    <p>Username: {user_data_user_name}</p>
                    <p>Password: {user_data_password}</p>

                    <br />
                    <button onClick={toggle_light_and_dark_mode}>Toggle Dark-Light</button>
                    <br />
                    <button onClick={logout_user}>Logout</button>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default HomePageSubMenu

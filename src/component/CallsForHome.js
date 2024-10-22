import React from 'react'
import './css_files/CallsForHome.css'

function CallsForHome({set_dark_mode}) {
    const search_icon = require(`./Data/Home_page_data/${set_dark_mode}/search.png`);
    const profile_icon = require(`./Data/Home_page_data/${set_dark_mode}/user.png`);
    const telephone = require(`./Data/Home_page_data/${set_dark_mode}/telephone.png`);

    const UserListItem = ({is_chat_on,user_profile})=>{
        return(
          
            <div className={`item_con ${is_chat_on && 'active'}`}>
                <div className="profile_pic">
                    <img src={user_profile} alt="" />
                </div>
                <div className="user_data">
                    <div className="user_data_1">
                        <div className="profile_name">Jay</div>
                        <div className="last_message_time">17:34</div>
                    </div>
                    <div className="user_data_2">
                        <div className="last_message_info">Incoming Call</div>
                    </div>
                </div>
            </div>
          
        )
    }
  return (

    <div id="main_call_con">
           <div className={`user_list_con ${set_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
            <div className="title_menu">
                <div className="title">Calls</div>
                <div className="title_item">
                    <img src={telephone} alt="" />
                </div>
            </div>

            <div className="search_input">
                <div className="icon">
                    <img src={search_icon} alt="" />
                </div>
                <input type="text" placeholder='Search or start a new chat'/>
            </div>

            <div className="user_s_list">
                <UserListItem is_chat_on={true} user_profile={profile_icon} is_pin_top={true} new_message={1}/>
                <UserListItem is_chat_on={false} user_profile={profile_icon} is_pin_top={true} new_message={0}/>
            </div>
        </div>

        <div className="active_chat">

        </div>
    </div>
  )
}

export default CallsForHome

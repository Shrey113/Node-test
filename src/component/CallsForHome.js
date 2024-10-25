import React, { useEffect, useState } from 'react';
import './css_files/CallsForHome.css';
import io from 'socket.io-client';

const socket = io('https://test-node-90rz.onrender.com');

function CallsForHome({ set_dark_mode,user_data_email }) {
  const search_icon = require(`./Data/Home_page_data/${set_dark_mode}/search.png`);
  const profile_icon = require(`./Data/Home_page_data/${set_dark_mode}/user.png`);
  const telephone = require(`./Data/Home_page_data/${set_dark_mode}/telephone.png`);


  const [list_of_users, set_list_of_users] = useState([]);

  const fetch_users_data = async () => {
    try {
        const response = await fetch('https://test-node-90rz.onrender.com/get_users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        set_list_of_users(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
useEffect(() => {
    fetch_users_data();
}, []); 

  const UserListItem = ({is_chat_on,receiver_email,sender_email,reverser_user_name,
    user_profile,is_pin_top,new_message
})=>{
    return(
      
        <div className={`item_con ${is_chat_on && 'active'}`} >
            <div className="profile_pic">
                <img src={user_profile} alt="" />
            </div>
            <div className="user_data">
                <div className="user_data_1">
                    <div className="profile_name">{reverser_user_name}</div>
                    <div className="last_message_time">17:34</div>
                </div>
                <div className="user_data_2">
              
               <div className="last_message_info">you reacted</div>  
               
                    
                    <div className="profile_state_icon">
                        {new_message !==0 && <div className="new_message_number">{`${new_message}`}</div>}
                        {is_pin_top && new_message === 0 &&<img src={telephone} alt="" />}
                    </div>
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
          <input type="text" placeholder="Search or start a new chat" />
        </div>

        <div className="user_s_list">
        {list_of_users.map((user, index) => (
              user_data_email !== user.email && (
              <UserListItem key={index} is_chat_on={true}
                receiver_email={user.email} sender_email={user_data_email} reverser_user_name={user.username}
                user_profile={profile_icon} is_pin_top={false} new_message={0} 
                />
              )
              ))}
        </div>
      </div>

      <div className="active_chat">
        5
        </div>

    </div>
  );
}

export default CallsForHome;

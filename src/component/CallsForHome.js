import React  from 'react';
import './css_files/CallsForHome.css';


function CallsForHome({ set_dark_mode,user_data_email,

  list_of_users,set_list_of_users

 }) {
  const search_icon = require(`./Data/Home_page_data/${set_dark_mode}/search.png`);
  const profile_icon = require(`./Data/Home_page_data/${set_dark_mode}/user.png`);
  const telephone = require(`./Data/Home_page_data/${set_dark_mode}/telephone.png`);






  const UserListItem = ({is_chat_on,receiver_email,sender_email,reverser_user_name,
    user_set_profile,is_pin_top,new_message
})=>{

  const imageSrc = user_set_profile ? user_set_profile : profile_icon;
    return(
      
        <div className={`item_con ${is_chat_on && 'active'}`} >
            <div className="profile_pic">
                <img src={imageSrc} alt="" />
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
              <UserListItem key={index} is_chat_on={index - 1  ? true : false}
                receiver_email={user.email} sender_email={user_data_email} reverser_user_name={user.username}
                user_profile={profile_icon} is_pin_top={false} new_message={0} 
                user_set_profile={user.profile_image}
                />
              )
              ))}
        </div>
      </div>

      <div className="active_chat">
        


        
        </div>

    </div>
  );
}

export default CallsForHome;

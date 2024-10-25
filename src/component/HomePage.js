import { React, useState, useEffect,useRef} from 'react';
import EmojiPicker from 'emoji-picker-react'
import io from "socket.io-client";

import './css_files/HomePage.css'
import './css_files/ChatsForHome.css'

import HomePageSubMenu  from './sub_component/HomePageSubMenu'
import CallsForHome from './CallsForHome';


const socket = io("https://test-node-90rz.onrender.com");
socket.on("connect", () => {
  console.log("Connected to the server!");
});

const localstorage_key_for_jwt_user_side_key = 'Jwt_user_localstorage_key_on_chat_x';
function HomePage() {

  // toggle menu for all file
  const [is_dark_mode, set_is_dark_mode] = useState('Dark');
  const [show_full_menu, set_show_full_menu] = useState(false);
  const [active_page,set_active_page] = useState("Chats")
  const [show_sub_pop_menu,set_show_sub_pop_menu] = useState({show_pop:false,pop_data:''});
  
  // Data and use state  require for a --------- home page ----------------------------------------
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

  // Data and use state  require for a --------- Chat page ----------------------------------------
  const app_icon = require(`./Data/web_site_logo.png`);
  const menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/menu.png`);
  const cancel_icon = require(`./Data/Home_page_data/${is_dark_mode}/cancel.png`);
  const more_icon = require(`./Data/Home_page_data/${is_dark_mode}/more.png`);
  const edit_icon = require(`./Data/Home_page_data/${is_dark_mode}/edit.png`);
  const search_icon = require(`./Data/Home_page_data/${is_dark_mode}/search.png`);
  const profile_icon = require(`./Data/Home_page_data/${is_dark_mode}/user.png`);
  const pin_icon = require(`./Data/Home_page_data/${is_dark_mode}/thumbtacks.png`);
  const telephone = require(`./Data/Home_page_data/${is_dark_mode}/telephone.png`);
  const happiness_icon = require(`./Data/Home_page_data/${is_dark_mode}/happiness.png`);
  const microphone_icon = require(`./Data/Home_page_data/${is_dark_mode}/microphone.png`);
  const attach_file_icon = require(`./Data/Home_page_data/${is_dark_mode}/attach-file.png`);
  const send_icon = require(`./Data/Home_page_data/${is_dark_mode}/send.png`);
  
  const [reverser_messages, set_reverser_messages] = useState([]); 
  const [input_message, set_input_message] = useState("");
  const [current_active_room_id,set_current_active_room_id] = useState('');
  const [current_active_room_data,set_current_active_room_data] = useState({
    active_user_name:'',
    active_email:''
  });
  const [list_of_users, set_list_of_users] = useState([]);
  const[list_of_active_user,set_list_of_active_user] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [show_new_message_con, set_show_new_message_con] = useState(false);
  const [show_new_message_data, set_show_new_message_data] = useState({
      new_message_email:'',
      new_message_message:''
  });
  const[show_type_animation,set_show_type_animation] = useState(false);
  const[show_emoji_piker,set_show_emoji_piker] = useState(false);
  const input_message_ref = useRef(null);
  const chat_container_ref = useRef(null);

  // get data from JWT
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
        let user_email = data.userData.email
        set_user_data_email(user_email);
        set_user_data_user_name(data.userData.username);
        set_user_data_password(data.userData.password);
        if(user_email){
          socket.emit("user_info",{user_email});
          socket.off("user_info");
      }
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
      });
    }
  }, []);

 // height => ? reverser_messages 
 useEffect(() => {
     if (chat_container_ref.current) {
         chat_container_ref.current.scrollTop = chat_container_ref.current.scrollHeight;
     }
 }, [reverser_messages]);


const get_user_data_by_email = (email) => {
     const user = list_of_users.find((user) => user.email === email);
     if (user) {
         return {"_id": user._id,
             "username": user.username,
             "email": user.email,
             "password": user.password,
             "is_public": user.is_public,
             "__v": user.__v};
     } else {return null}
};


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

//  socket == > show_type_animation
 useEffect(()=>{
     socket.on('show_type_animation',(data)=>{
         if(data.receiver_email === user_data_email) {
             if(data.sender_email === current_active_room_data.active_email){
                 set_show_type_animation(true)
             }
         }
     })
     return(()=>{
         socket.off('show_type_animation')
     })
 },[user_data_email,current_active_room_data.active_email]);

//  socket == > off_type_animation
 useEffect(()=>{
     socket.on('off_type_animation',(data)=>{
         if(data.sender_email === current_active_room_data.active_email) {
             if(data.receiver_email === user_data_email){
                 set_show_type_animation(false)
             }
         }
     })
     return(()=>{
         socket.off('off_type_animation')
     })
 },[user_data_email,current_active_room_data.active_email]);


 function format_date_ime(isoString) {
     const date = new Date(isoString);
 
     const time = date.toLocaleTimeString('en-US', {
         hour: 'numeric',
         minute: 'numeric',
         hour12: true
     });
 
     const formattedDate = date.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
     });
 
     return {
         time: time,
         date: formattedDate,
     };
 }

 const typing_timer = useRef(null);
 const isTyping = useRef(false); 

 const onEmojiClick = (emojiObject) => {
     set_input_message(prevInput => prevInput + emojiObject.emoji);
   };

 const append_new_message = (e) => {   
     if (typing_timer.current) {
       clearTimeout(typing_timer.current);
     }

     // User started typing
     if (!isTyping.current) {
      if(input_message !== ''){
        socket.emit("chat_typing_start_at",{
          sender_email:user_data_email,
          receiver_email:current_active_room_data.active_email,
      })
        isTyping.current = true;
      }
       
     }
     typing_timer.current = setTimeout(() => {
      
       if (input_message.trim()) {
         socket.emit("chat_typing_end_at",{
             sender_email:user_data_email,
             receiver_email:current_active_room_data.active_email,
         })
       }
       isTyping.current = false;
     }, 700);

     // Check for the Enter key press
     if (e.key === 'Enter') {
       const send_message_data = {
         message: input_message || '',
         receiver_email: current_active_room_data.active_email,
         sender_email: user_data_email,
         time: new Date(),
       };

       // Send the message through the socket
       socket.emit('sendNotification', {
         ...send_message_data,
         room_id: current_active_room_id,
       });
       set_input_message("");
       isTyping.current = false; 
     }

     // end code
     socket.off("chat_typing_start_at")
     socket.off("chat_typing_end_at")
};




 
 useEffect(()=>{
   socket.on('data-updated',async (data)=>{

     const send_message_data = {
         sender_email:data.sender_email,
         receiver_email: data.receiver_email,
         message:data.message,
         time: new Date(),
     }
     

     let add_new_message_to_chat_box = async () => {
         set_reverser_messages((prev_messages) => [...prev_messages,send_message_data]);   
     };
     


     const show_pop = ()=>{
      set_show_new_message_con(true)
      set_show_new_message_data({
          new_message_email:data.sender_email,
          new_message_message:data.message
      })
      setTimeout(() => {
          set_show_new_message_con(false); 
      }, 4000);
      
      return ()=>{
        socket.off('data-updated');
      }
     }
     if(active_page !== 'Chats'){
      show_pop();
     }

     if(data.sender_email !== current_active_room_data.active_email 
      &&
      data.receiver_email === user_data_email
     ){
      show_pop();
    }

    if (data.sender_email === user_data_email && data.receiver_email === current_active_room_data.active_email){
      await add_new_message_to_chat_box();
      return ()=>{
          socket.off('data-updated');
      }   
  }
     if(data.receiver_email === user_data_email  && data.sender_email === current_active_room_data.active_email){
       await add_new_message_to_chat_box();     
     }
       
   })

   return ()=>{
     socket.off('data-updated');
   }
   
},[current_active_room_id,user_data_email,current_active_room_data.active_email,active_page])




async function  fetch_chat_data_by_room_id (room_id,receiver_email,sender_email){
 fetch('https://test-node-90rz.onrender.com/api/get_chat', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ 
       chat_id: room_id,
       receiver_email: receiver_email,
       sender_email: sender_email
     }),
   })
     .then((response) => {return response.json();})
     .then((data) => {
       if (data.message !== 'Chat not found') {
         set_reverser_messages([]); // Reset the messages
         set_reverser_messages((prevMessages) => [
           ...prevMessages,
           ...data.map((mes) => ({
             message: mes.message,
             receiver_email: mes.receiver_email,
             sender_email: mes.sender_email,
             time: mes.time,
           })),
         ]);
       } else {
         console.error("chat not found");
       }
     })
     .catch((err) => {
       console.error(err);
     });
}


 // for cahge a chat room
 function set_me_as_active_chat_room(sender_email,receiver_email,reverser_user_name){
     set_input_message("")
     if (input_message_ref.current) {
         input_message_ref.current.focus();
       }
     
     set_current_active_room_id(`${sender_email}_%_%#%_%_${receiver_email}`);
     set_current_active_room_data({
         active_user_name:reverser_user_name,
          active_email:receiver_email
     });

     fetch_chat_data_by_room_id(
         `${sender_email}_%_%#%_%_${receiver_email}`,
             sender_email,
             receiver_email
     );

 }


 useEffect(() => {
     socket.on("get_list_of_active_users", (data) => {
         const trueEmails = Object.entries(data)
         .filter(([email, isValid]) => isValid) 
         .map(([email]) => email);  
         set_list_of_active_user(trueEmails)        
     });
     return () => {
         socket.off("get_list_of_active_users");
     };
 }, []);

 useEffect(() => {
     if (list_of_active_user.includes(current_active_room_data.active_email)) {
       setUserStatus("Online");
     } else {
       setUserStatus("Offline");
     }
   }, [list_of_active_user, current_active_room_data.active_email]);
 

 // sub part of Chat ui --- >  One User List Item
 const UserListItem = ({is_chat_on,receiver_email,sender_email,reverser_user_name,
     user_profile,is_pin_top,new_message
 })=>{
     return(
       
         <div className={`item_con ${is_chat_on && 'active'}`} 
                 onClick={()=>{set_me_as_active_chat_room(sender_email,receiver_email,reverser_user_name);
                     }}>
             <div className="profile_pic">
                 <img src={user_profile} alt="" />
             </div>
             <div className="user_data">
                 <div className="user_data_1">
                     <div className="profile_name">{reverser_user_name}</div>
                     <div className="last_message_time">17:34</div>
                 </div>
                 <div className="user_data_2">
                  {list_of_active_user.includes(receiver_email) ? 
                <div className="info">
                  <div className="dot"></div>
                  Online</div>
                :
                <div className="last_message_info">you reacted</div>  
                }
                     
                     <div className="profile_state_icon">
                         {new_message !==0 && <div className="new_message_number">{`${new_message}`}</div>}
                         {is_pin_top && new_message === 0 &&<img src={pin_icon} alt="" />}
                     </div>
                 </div>
             </div>
         </div>
       
     )
 }

 // sub part of Chat ui --- >  all tyoe of message 
 const AddMessageToChatBox = ({is_server_message,send_by_email,message,time})=>{
     let current_user_email = user_data_email;
     let message_time = format_date_ime(time);
     if(is_server_message){
         return(
             <div className='message_box_server'>
                 <div className={`server_message_con ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                     <div className="text">
                         Messages and calls are end-to-end encrypted.No one outside of this chat,not even Chat x, can read or listen to them
                     </div>
                 </div>
             </div>)
     }
     if(send_by_email === current_user_email){
         return (
             <div className='message_box_receiving'>
                 <div className={`receiving_con ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                     <div className="text">{message}</div>
                     <div className="time">{message_time.time}</div>
                 </div>
             </div>)
     }else{
         return(
             <div className='message_box_sending'>
                 <div className={`sending_con  ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                     <div className="text">{message}</div>
                     <div className="time">{message_time.time}</div>
                 </div>
             </div>)
     }
 }

 const ShowNewMessage = ({ Email, message }) => {
     return (
       <>
         <div
           className={`show_user_new_message_con ${
             is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'
           }`}

           onClick={()=>{
            set_active_page("Chats");
            set_show_full_menu(false);
            set_me_as_active_chat_room(user_data_email,Email,get_user_data_by_email(Email).username);
          }}>
           <div className="top_bar">
             {/* Fix the invalid nesting by using <span> instead of <div> */}
             <p>
               <img className="app_icon_nof" src={app_icon} alt="" />
               <span className="app_name">Chat X</span>
             </p>
             <p>
               <img className="side_nfo" src={more_icon} alt="" />
               <img className="side_nfo" src={cancel_icon} alt="" />
             </p>
           </div>
           <div className="main_part">
             <img src={profile_icon} alt="" />
             <div className="data">
               <p>{Email}</p>
               <span>{message}</span>
             </div>
           </div>
         </div>
       </>
     );
   };




// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 

  return (
    
    <div id="home_page" className={is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}>
      {show_new_message_con && <ShowNewMessage Email={show_new_message_data.new_message_email} message={show_new_message_data.new_message_message} />}
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

        <div id="main_chats_con">
          

          <div className={`user_list_con ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>
            <div className="title_menu">
              <div className="title">Chats</div>
              <div className="title_item">
                <img src={edit_icon} alt="" />
                <img src={menu_icon} alt="" onClick={fetch_users_data} />
              </div>
            </div>

            <div className="search_input">
              <div className="icon">
                <img src={search_icon} alt="" />
              </div>
              <input type="text" placeholder='Search or start a new chat' />
            </div>

            <div className="user_s_list">
              {list_of_users.map((user, index) => (
              user_data_email !== user.email && (
              <UserListItem key={index} is_chat_on={current_active_room_data.active_user_name===user.username}
                receiver_email={user.email} sender_email={user_data_email} reverser_user_name={user.username}
                user_profile={profile_icon} is_pin_top={false} new_message={0} />
              )
              ))}

            </div>
          </div>

          <div className="active_chat">
            {current_active_room_data.active_user_name ?
            <>
              {/* active_chat > top profile part */}
              <div className={`user_top_data ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>
                <div className="profile_pic">
                  <img src={profile_icon} alt="" />
                </div>
                <div className="other_data">
                  <div className="user_name">
                    {current_active_room_data.active_user_name}
                  </div>
                  <div className="user_State">
                    <div className="set_online">
                      {show_type_animation ?
                      <div className="show_active_typing_anim">
                        <div className="text">
                          <p>Typing</p>
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </div>
                      </div>

                      :<>
                        <div className={userStatus==='Offline' ? 'dot_red' :'dot_green'}></div>
                        {userStatus}
                      </>
                      }

                    </div>
                  </div>

                </div>

                <div className="other_menu">
                  <div className="call_option">
                    <img src={telephone} alt="" />
                    <img src={telephone} alt="" />
                  </div>
                  <div className="search">
                    <img src={search_icon} alt="" />
                  </div>

                </div>
              </div>

              {/* active_chat > main caht box */}
              <div ref={chat_container_ref} className={`main_chat ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode'
                }`}>
                <AddMessageToChatBox is_server_message={true} />
                {reverser_messages.map((msg, index) => (
                <AddMessageToChatBox key={index} message={msg.message} time={msg.time}
                  send_by_email={msg.receiver_email} />
                ))}

                {show_emoji_piker &&
                <>
                  <div className='emoji_box_con' onClick={()=>{set_show_emoji_piker(false)}}> </div>
                  <div className="emoji_box">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                </>
                }
              </div>

              {/* active_chat > bottom input */}
              <div className={`user_bottom_input ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>

                <div className="menu_item">
                  <img src={happiness_icon} alt="Happiness" onClick={()=>{set_show_emoji_piker(true)}} />
                  <img src={attach_file_icon} alt="Attach" />
                </div>

                <input type="text" placeholder="Type a message" ref={input_message_ref}
                  className={is_dark_mode==='Light' ? 'light_mode' : 'dark_mode' } value={input_message}
                  onChange={(e)=>
                set_input_message(e.target.value)}
                onKeyDown={(e)=>{append_new_message(e)}}
                autoFocus
                />
                {input_message &&
                <img className="microphone_icon" src={cancel_icon} alt="Microphone" onClick={()=>{
                set_input_message("")
                }}
                />
                }

                {input_message ?
                <img className="send_button" src={send_icon} alt="Microphone" onClick={()=>{
                if(input_message_ref){
                input_message_ref.current?.dispatchEvent(new KeyboardEvent('keydown',
                { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                }
                }}
                />
                :
                <img className="microphone_icon" src={microphone_icon} alt="Microphone" />
                }

              </div>

            </> :
            <div className={`no_any_active_chat ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>
              No chat select <br /> Select chat form side
            </div>
            }

          </div>{/* clsoe a active chat */}
        </div>



        
        }
    {active_page === 'Calls' && <CallsForHome set_dark_mode={is_dark_mode} user_data_email={user_data_email} />}
    {active_page === 'Status' && <>
      <h2>This is the home page</h2>
      <h3>Email: {user_data_email}</h3>
      <h3>Username: {user_data_user_name}</h3>
      <h3>Password: {user_data_password}</h3>



    </>}
    </div>
    {show_sub_pop_menu.show_pop 
      && <HomePageSubMenu 
          logout_user={()=>{
            window.localStorage.removeItem(localstorage_key_for_jwt_user_side_key);
            window.location.reload();
          }}
          toggle_light_and_dark_mode={()=>{set_is_dark_mode(is_dark_mode=== 'Dark' ? 'Light':'Dark')}}
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


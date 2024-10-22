import {React,useState,useEffect,useRef} from 'react'
import './css_files/ChatsForHome.css'
import io from 'socket.io-client';
const socket = io('https://node-test-back-pps0yyp5l-shrey113s-projects.vercel.app');

function ChatsForHome({set_dark_mode,user_data_email,user_name}) {

    const [reverser_messages, set_reverser_messages] = useState([]); 
    const [inputMessage, setInputMessage] = useState("");
    const [current_active_room_id,set_current_active_room_id] = useState();
    const [current_active_room_data,set_current_active_room_data] = useState({active_user_name:'',active_email:''});
    const [list_of_users, set_list_of_users] = useState([]);
    

    // on new Chat scroll down
    const chat_container_ref = useRef(null);
    useEffect(() => {
        if (chat_container_ref.current) {
            chat_container_ref.current.scrollTop = chat_container_ref.current.scrollHeight;
        }
    }, [reverser_messages]);



    const fetch_users_data = async () => {
        try {
            const response = await fetch('https://node-test-g5gn.vercel.app/get_users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set_list_of_users(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // one time call fetch users data
    useEffect(() => {
        fetch_users_data();
    }, []); 

    // add icon and img form Data (Light and dark)
    const menu_icon = require(`./Data/Home_page_data/${set_dark_mode}/menu.png`);
    const edit_icon = require(`./Data/Home_page_data/${set_dark_mode}/edit.png`);
    const search_icon = require(`./Data/Home_page_data/${set_dark_mode}/search.png`);
    const profile_icon = require(`./Data/Home_page_data/${set_dark_mode}/user.png`);
    const pin_icon = require(`./Data/Home_page_data/${set_dark_mode}/thumbtacks.png`);
    const telephone = require(`./Data/Home_page_data/${set_dark_mode}/telephone.png`);
    const happiness_icon = require(`./Data/Home_page_data/${set_dark_mode}/happiness.png`);
    const microphone_icon = require(`./Data/Home_page_data/${set_dark_mode}/microphone.png`);
    const attach_file_icon = require(`./Data/Home_page_data/${set_dark_mode}/attach-file.png`);

    // set time > to 00:00 Am
    const format_time = (isoString) => {
        const date = new Date(isoString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
    
        const formattedHours = (hours % 12) || 12;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const fetch_chat_data_by_room_id = async () => {
        try {
          const response = await fetch('https://node-test-g5gn.vercel.app/api/get_chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              chat_id: current_active_room_id,
              reverser_email:current_active_room_data.active_email,
              sender_email:user_data_email
             }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch chat data');
          }
    
          const data = await response.json();

          set_reverser_messages([])
          
          if (data.message !== 'Chat not found'){
              set_reverser_messages((prevMessages) => [
                  ...prevMessages,
                  ...data.map((mes) => ({
                    message: mes.message,
                    reverser_email: mes.reverser_email,
                    sender_email: mes.sender_email,
                    time: mes.time,
                  })),
                ]);   
          }
          console.log(data); 
        } catch (err) {
          console.log(err);
        }
      };

      const sendNewMessage = async (newMessage) => {
        try {
            const response = await fetch('https://node-test-g5gn.vercel.app/api/send_message', { // Update the endpoint as needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: newMessage.message,
                    reverser_email: newMessage.reverser_email,
                    sender_email: newMessage.sender_email,
                    time: new Date().toISOString(), // Send the timestamp
                    chat_id: current_active_room_id, // Include chat_id if needed
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to send new message');
            }
    
            const data = await response.json();
            console.log('Message sent:', data); // Log response from the server
    
        } catch (err) {
            console.error(err);
        }
    };

     
    //   on chage current_active_room_id 
    useEffect(()=>{
      socket.on('data-updated',(data)=>{
          let chat_id_1 = `${user_data_email}_%_%#%_%_${current_active_room_data.active_email}`
          let chat_id_2 = `${current_active_room_data.active_email}_%_%#%_%_${user_data_email}`

          
          if(data.update_email === user_data_email){
              if (data.room_id !== chat_id_1){
                if (data.room_id !== chat_id_2){
                  return
                }
              }else{
                console.log("2 chat not match");
              }
              console.log("3 chat not match");
  

              let fetch_chat_data_by_room_id_2 = async () => {
                try {
                  const response = await fetch('https://node-test-g5gn.vercel.app/api/get_chat', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                      chat_id: current_active_room_id,
                      reverser_email:current_active_room_data.active_email,
                      sender_email:user_data_email
                     }),
                  });
            
                  if (!response.ok) {
                    throw new Error('Failed to fetch chat data');
                  }
            
                  const data = await response.json();

                  set_reverser_messages([])

                  if (data.message !== 'Chat not found'){
                    
                      set_reverser_messages((prevMessages) => [
                          ...prevMessages,
                          ...data.map((mes) => ({
                            message: mes.message,
                            reverser_email: mes.reverser_email,
                            sender_email: mes.sender_email,
                            time: mes.time,
                          })),
                        ]);   
                  }
                  console.log(data); 
                } catch (err) {
                  console.log(err);
                }
              };

              fetch_chat_data_by_room_id_2()      
          }
          
      })
  },[current_active_room_id,user_data_email,current_active_room_data.active_email])

    useEffect(() => {
      set_reverser_messages([]);
        let fetchChatData_2 = async () => {
            try {
              const response = await fetch('https://node-test-g5gn.vercel.app/api/get_chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  chat_id: current_active_room_id,
                  reverser_email:current_active_room_data.active_email,
                  sender_email:user_data_email
                }),
              });
        
              if (!response.ok) {
                throw new Error('Failed to fetch chat data');
              }
        
              const data = await response.json();
    
              
              if (data.message !== 'Chat not found'){
                  
                  set_reverser_messages((prevMessages) => [
                      ...prevMessages,
                      ...data.map((mes) => ({
                        message: mes.message,
                        reverser_email: mes.reverser_email,
                        sender_email: mes.sender_email,
                        time: mes.time,
                      })),
                    ]);
              }
            } catch (err) {
              console.log(err);
            }
          };
        if (current_active_room_id) {
          fetchChatData_2();
        }
      }, [current_active_room_id,user_data_email,current_active_room_data.active_email]);

    // on clik enter
    const handle_send_message = async (e) => {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
        // Create the message object
        const messageData = {
            message_type: 'send_message',
            reverser_email: current_active_room_data.active_email,
            sender_email: user_data_email,
            message: inputMessage,
            time: currentTime,
        };
    
        if (e.key === 'Enter') {
          setInputMessage("");
          await sendNewMessage(messageData);
          await fetch_chat_data_by_room_id();
          socket.emit('sendNotification', { 
                    update_email: current_active_room_data.active_email,
                    room_id: current_active_room_id,
                   });
    
        }
    };
    
    // for cahge a chat room
    function set_me_as_active_chat_room(sender_email,reverser_email,reverser_user_name){
        set_current_active_room_id(`${sender_email}_%_%#%_%_${reverser_email}`);
        set_current_active_room_data({
            active_user_name:reverser_user_name,
             active_email:reverser_email
        })
        
    }


    // sub part of Chat ui --- >  One User List Item
    const UserListItem = ({is_chat_on,reverser_email,sender_email,reverser_user_name,
        user_profile,is_pin_top,new_message
    })=>{
        return(
          
            <div className={`item_con ${is_chat_on && 'active'}`} 
                    onClick={()=>{set_me_as_active_chat_room(sender_email,reverser_email,reverser_user_name);}}>
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
                            {is_pin_top && new_message === 0 &&<img src={pin_icon} alt="" />}
                        </div>
                    </div>
                </div>
            </div>
          
        )
    }

    // sub part of Chat ui --- >  all tyoe of message 
    const AddMessageToChatBox = ({is_server_message,send_by_email,current_user_email,message,time})=>{
        if(is_server_message){
            return(
                <div className='message_box_server'>
                    <div className={`server_message_con ${set_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                        <div className="text">
                            Messages and calls are end-to-end encrypted.No one outside of this chat,not even Chat x, can read or listen to them
                        </div>
                    </div>
                </div>)
        }
        if(send_by_email === current_user_email){
            return (
                <div className='message_box_receiving'>
                    <div className={`receiving_con ${set_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                        <div className="text">{message}</div>
                        <div className="time">{time}</div>
                    </div>
                </div>)
        }else{
            return(
                <div className='message_box_sending'>
                    <div className={`sending_con  ${set_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                        <div className="text">{message}</div>
                        <div className="time">{time}</div>
                    </div>
                </div>)
        }
    }
    
  return (
    <>
        <div id="main_chats_con">
            <div className={`user_list_con ${set_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>
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
                    <UserListItem key={index} 
                        is_chat_on={current_active_room_data.active_user_name === user.username}
                         reverser_email={user.email}
                        sender_email={user_data_email} reverser_user_name={user.username} user_profile={profile_icon}
                        is_pin_top={false} new_message={0} />
                    )
                    ))}

                </div>
            </div>

            <div className="active_chat">
                {current_active_room_data.active_user_name ?
                <>
                    {/* active_chat >  top profile part */}
                    <div className={`user_top_data ${set_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>
                        <div className="profile_pic">
                            <img src={profile_icon} alt="" />
                        </div>
                        <div className="other_data">
                            <div className="user_name">
                                {current_active_room_data.active_user_name}
                            </div>
                            <div className="user_State">
                                <div className="set_online">
                                    <div className="dot"></div>
                                    <p>Online</p>
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

                    {/* active_chat >  main caht box */}
                    <div ref={chat_container_ref} className={`main_chat ${set_dark_mode==='Light' ? 'light_mode'
                        : 'dark_mode' }`}>
                        <AddMessageToChatBox is_server_message={true} />
                        {reverser_messages.map((msg, index) => (
                        <AddMessageToChatBox key={index} message={msg.message} time={format_time(msg.time)}
                            send_by_email={msg.reverser_email} current_user_email={user_data_email} />
                        ))}
                    </div>

                    {/* active_chat >  bottom input */}
                    <div className={`user_bottom_input ${set_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>
                        <div className="menu_item">
                            <img src={happiness_icon} alt="Happiness" />
                            <img src={attach_file_icon} alt="Attach" />
                        </div>
                        <input type="text" placeholder="Type a message" className={set_dark_mode==='Light'
                            ? 'light_mode' : 'dark_mode' } value={inputMessage} onChange={(e)=>
                        setInputMessage(e.target.value)}
                        onKeyDown={handle_send_message}
                        />
                        <img className="microphone_icon" src={microphone_icon} alt="Microphone" />
                    </div>

                </> : 
                <div className={`no_any_active_chat ${set_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>
                    No chat select <br /> Select chat form side
                </div>
                }

            </div>{/* clsoe a active chat */}
        </div>
    </>
  )
}

export default ChatsForHome;

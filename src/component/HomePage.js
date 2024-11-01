import { React, useState, useEffect,useRef} from 'react';
import EmojiPicker from 'emoji-picker-react'
import io from "socket.io-client";

import './css_files/HomePage.css'
import './css_files/ChatsForHome.css'
import './css_files/ChatPinMenu.css'

import HomePageSubMenu  from './sub_component/HomePageSubMenu'
import CallsForHome from './CallsForHome';
import ShowQuestionPop from './sub_component/ShowQuestionPop';
import ChatUserProfile from './sub_component/HomePageSubMenu2';
import FullImgView from './sub_component/FullImgView';
import CameraCapture from './CameraCapture';

import { client_data} from './Clint_data';


const socket = io("https://test-node-90rz.onrender.com");
socket.on("connect", () => {
  console.log("Connected to the server!");
});

const localstorage_key_for_jwt_user_side_key = 'Jwt_user_localstorage_key_on_chat_x';
function HomePage() {

  // toggle menu for all file
  const [is_dark_mode, set_is_dark_mode] = useState('Dark');
  const [show_full_menu, set_show_full_menu] = useState(false);
  const [active_page,set_active_page] = useState("Chats");

  const [show_sub_pop_menu,set_show_sub_pop_menu] = useState({show_pop:false,pop_data:''});
  const [show_question_menu,set_show_question_menu] = useState(false);
  const [show_question_menu_data,set_show_question_menu_data] = useState({
    title:'',
    message:'',
    no_button_fun:null,
    yes_button_fun:null,

  });

  const[show_emoji_piker,set_show_emoji_piker] = useState(false);
  const [show_right_click_menu,set_show_right_click_menu] = useState(false)
  const [show_right_click_menu_position,set_show_right_click_menu_position] = useState({ x: 0, y: 0 });
  const [show_pin_menu,set_show_pin_menu] = useState(false);


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
  const [user_data_profile_img,set_user_data_profile_img] = useState('');
  

  // Data and use state  require for as --------- Chat page ----------------------------------------
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
  const back_icon = require(`./Data/Home_page_data/${is_dark_mode}/back.png`);

  const tick_icon = require(`./Data/Home_page_data/${is_dark_mode}/check.png`);
  const tick_true_icon = require(`./Data/Home_page_data/${is_dark_mode}/check_true.png`);
  
  const [reverser_messages, set_reverser_messages] = useState([]);
  const[read_mes_id_list,set_read_mes_id_list] = useState([]);
  const [page_for_message, set_page_for_message] = useState(1);
  const [next_page_button,set_next_page_button] = useState(false);

  const [message_loading,set_message_loading] = useState(false);
  const [message_sub_loading,set_message_sub_loading] = useState(false);

  const [input_message, set_input_message] = useState("");
  const [current_active_room_id,set_current_active_room_id] = useState('');
  const [current_active_room_data,set_current_active_room_data] = useState({
    active_user_name:'',
    active_email:'',
    active_profile_img:'',
    active_user_about:''
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
  const [isAtBottom, setIsAtBottom] = useState(true);

  const typing_timer = useRef(null);
  const isTyping = useRef(false); 
  const input_message_ref = useRef(null);
  const chat_container_ref = useRef(null);

  const [show_active_user_info_pop,set_show_active_user_info_pop] = useState(false)


  const [full_img_view,set_full_img_view] = useState(false)
  const [full_img_data,set_full_img_data] = useState({
    show_bottom_list:null,
    show_full_menu:null,
    main_img_to_show:null,
    all_bottom_list:null,
    file_close_function:null,
  })
  
  const scrollToBottom = () => {
    if (chat_container_ref.current) {
      chat_container_ref.current.scrollTop = chat_container_ref.current.scrollHeight;
      setIsAtBottom(true)
    }
  };
  

  const handleScroll = () => {
    const container = chat_container_ref.current;
    if (container) {
      const isScrolledToBottom = 
        Math.ceil(container.scrollHeight - container.scrollTop) <= container.clientHeight;
      setIsAtBottom(isScrolledToBottom);
    }
  };


  const fetch_users_data = async (email) => {
    try {
        const response = await fetch(`https://test-node-90rz.onrender.com/get_users?email=${email}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); 
        set_current_active_room_id('');
        set_current_active_room_data({
          active_user_name:'',
          active_email:'',
          active_profile_img:'',
          active_user_about:''
        })
        set_list_of_users(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};



  useEffect(() => {
        let user_email = client_data.email
        set_user_data_email(user_email)
        set_user_data_user_name(client_data.username);
        set_user_data_password(client_data.password);
        fetch_users_data(user_email)
        set_user_data_profile_img(client_data.profile_image_url);
        if(user_email){
          socket.emit("user_info",{user_email});
          socket.off("user_info");
      }
  }, []);

 // height => ? reverser_messages 
 useEffect(() => {
     if (chat_container_ref.current) {
      if(page_for_message === 1){
        chat_container_ref.current.scrollTop = chat_container_ref.current.scrollHeight;
      }
     }
 }, [reverser_messages,page_for_message]);



 // data by => email
const get_user_data_by_email = (email) => {
     const user = list_of_users.find((user) => user.email === email);
     if (user) {
         return {"_id": user._id,
             "username": user.username,
             "email": user.email,
             "password": user.password,
             "about_user": user.about_user,
             "is_public": user.is_public,
             "profile_image": user.profile_image,
             "profile_image_type": user.profile_image_type,
             "last_active_time":user.last_active_time || null,
             "__v": user.__v};
     } else {return null}
};


function get_last_active_time(){
  let data = get_user_data_by_email(current_active_room_data.active_email).last_active_time;
  if (data){
    let set_time = format_date_time(data)
    if (set_time.is_more_than_12_hr){
      return `Last active ${set_time.date}`
    }else{
      return `Last active ${set_time.time}`
    }
  }else{
    return null
  }
}

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

 // full time => time and full date
 function format_date_time(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const timeDifference = now - date;

  // (12 * 60 * 60 * 1000)
  const is_more_than_12_hr = timeDifference > 43200000  ;

  const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
  });

  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;


  return {
      time: time,
      date: formattedDate,
      is_more_than_12_hr: is_more_than_12_hr
  };
}

 // key down ? show (typing...) :None
 // key down == 'Enter' && send message
 const append_new_message = (e) => {   
    if(input_message === ''){
      return;
    }
     if (typing_timer.current) {
       clearTimeout(typing_timer.current);
     }

     // User started ... typing
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
         send_time: new Date(),
         is_read: false,
         read_time: new Date(),
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
  let sender_email = user_data_email;
  socket.on(`new_img_add_for_${sender_email}`,(data)=>{    
    const newMessages = {
      message: data.message,
      receiver_email: data.receiver_email,
      sender_email: data.sender_email,
      send_time: data.send_time,
      is_read: data.is_read,
      read_time: data.read_time,
      is_in_chat_img: data.is_in_chat_img,
      chat_img_src: data.chat_img_src && data.chat_img_src.data
          ? `data:image/png;base64,${getBase64FromArrayBuffer(data.chat_img_src.data)}`
          : null,
  };

  set_reverser_messages((prevMessages) => [...prevMessages, newMessages]);
  })
  return(()=>{
      socket.off(`new_img_add_for_${sender_email}`)
  })
},[user_data_email]);


useEffect(()=>{
  let active_receiver_email = current_active_room_data.active_email;
  socket.on(`new_img_add_for_${active_receiver_email}`,(data)=>{
    
    if(active_receiver_email === data.sender_email){
    
      const getBase64FromArrayBuffer = (data) => {
        const byteCharacters = new Uint8Array(data);
        let byteString = '';
        for (let i = 0; i < byteCharacters.length; i++) {
          byteString += String.fromCharCode(byteCharacters[i]);
        }
        return btoa(byteString);
      };
      const newMessages = {
        message: data.message,
        receiver_email: data.receiver_email,
        sender_email: data.sender_email,
        send_time: data.send_time,
        is_read: data.is_read,
        read_time: data.read_time,
        is_in_chat_img: data.is_in_chat_img,
        chat_img_src: data.chat_img_src && data.chat_img_src.data
            ? `data:image/png;base64,${getBase64FromArrayBuffer(data.chat_img_src.data)}`
            : null,
    };
    set_reverser_messages((prevMessages) => [...prevMessages, newMessages]);
    }



  })
  return(()=>{
      socket.off(`new_img_add_for_${active_receiver_email}`)
  })
},[current_active_room_data.active_email]);


// add only ? active chat : show pop menu 
 useEffect(()=>{
   socket.on('data-updated',async (data)=>{
     const send_message_data = {
        _id:data._id,
         sender_email:data.sender_email,
         receiver_email: data.receiver_email,
         message:data.message,
         send_time: data.send_time,
         is_read: data.is_read ,
         read_time:data.read_time, 
     }

     let add_new_message_to_chat_box = async () => {
         set_reverser_messages((prev_messages) => [...prev_messages,send_message_data]);   

         if (page_for_message !== 1){
          setTimeout(() => {
            chat_container_ref.current.scrollTop = chat_container_ref.current.scrollHeight;
           }, 200);
         }

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

     let is_receiver = data.receiver_email === user_data_email;
     let is_sender = data.sender_email === user_data_email;
     let is_active_email_chat = data.sender_email === current_active_room_data.active_email;
     let is_active_chat_page = active_page === 'Chats'

     if(!is_active_chat_page){
      show_pop();
     }
     if(!is_active_email_chat && is_receiver){
      show_pop();
    }

    if (is_sender && data.receiver_email === current_active_room_data.active_email){
      await add_new_message_to_chat_box();     
      return ()=>{
          socket.off('data-updated');
      }   
  }
     if(is_receiver  && is_active_email_chat){
       await add_new_message_to_chat_box();
     }
       
   })
   return ()=>{
     socket.off('data-updated');
   }
   
},[current_active_room_id,page_for_message,user_data_email,current_active_room_data.active_email,active_page])

//  get_chat by ID
const getBase64FromArrayBuffer = (data) => {
  const byteCharacters = new Uint8Array(data);
  let byteString = '';
  for (let i = 0; i < byteCharacters.length; i++) {
    byteString += String.fromCharCode(byteCharacters[i]);
  }
  return btoa(byteString);
};

async function fetch_chat_data_by_room_id(page,room_id, receiver_email, sender_email) {
  try {
    const response = await fetch('https://test-node-90rz.onrender.com/api/get_chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: room_id,
        receiver_email: receiver_email,
        sender_email: sender_email,
        page_for_message:page,
      }),
    });

    if (!response.ok) {
      set_reverser_messages([]);
      set_next_page_button(false)
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();


    

    if (data.show_null){
      set_reverser_messages([]);
      set_next_page_button(false)
      return ;
    }
    
    if (data.messages && data.messages.length > 0) {
      
      const newMessages = data.messages.map((mes) => ({
        _id:mes._id,
        message: mes.message,
        receiver_email: mes.receiver_email,
        sender_email: mes.sender_email,
        send_time: mes.send_time,
        is_read: mes.is_read,
        read_time: mes.read_time,
        is_in_chat_img: mes.is_in_chat_img,
        chat_img_src: mes.chat_img_src
          ? `data:image/png;base64,${mes.chat_img_src}`
          : null,
      }));

      
      set_reverser_messages([]);
      set_reverser_messages((prevMessages) => [...prevMessages, ...newMessages]);
    }
    else {
      set_reverser_messages([])
    }
  } catch (err) {
    set_reverser_messages([])
    console.error("Error fetching chat data:", err);
  }
}
// next page
// next page
// next page
// next page
// next page
// next page
// next page
const fetch_Next_Page = async () => {
  set_message_sub_loading(true)
  set_page_for_message(prevPage => prevPage + 1);
    try {
      const response = await fetch('https://test-node-90rz.onrender.com/api/get_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: current_active_room_id,
          receiver_email: current_active_room_data.active_email,
          sender_email: user_data_email,
          page_for_message: page_for_message + 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.show_null){
        set_next_page_button(false)
        set_message_sub_loading(false)
        return ;
      }

      if (data.messages && data.messages.length > 0) {
        const newMessages = data.messages.map((mes) => ({
          message: mes.message,
          receiver_email: mes.receiver_email,
          sender_email: mes.sender_email,
          send_time: mes.send_time,
          is_read: mes.is_read,
          read_time: mes.read_time,
          is_in_chat_img: mes.is_in_chat_img,
          chat_img_src: mes.chat_img_src
          ? `data:image/png;base64,${mes.chat_img_src}`
          : null,
      }));

        set_reverser_messages((prevMessages) => [...newMessages, ...prevMessages]);
        set_message_sub_loading(false)
      } else {
        set_reverser_messages([]);
        set_message_sub_loading(false)
      }
    } catch (err) {
      set_reverser_messages([]);
      set_message_sub_loading(false)
      console.error("Error fetching chat data:", err);
    }



};

function test(receiver_email){
  let email = user_data_email
  let sender_email = user_data_email
  socket.emit("set_message_read",{email,sender_email,receiver_email});
}

 // for cahge a chat room
 async function set_me_as_active_chat_room(sender_email,receiver_email){
    set_message_loading(true);
    const sub_data = get_user_data_by_email(receiver_email)
    set_input_message("")
    if (input_message_ref.current) {
        input_message_ref.current.focus();
      }
    set_current_active_room_id(`${sender_email}_%_%#%_%_${receiver_email}`);
    set_current_active_room_data({
      active_email:receiver_email,
      active_user_name:sub_data.username,
      active_profile_img:sub_data.profile_image,
      active_user_about:sub_data.about_user,
    });
    set_next_page_button(true)
    set_page_for_message(1);
    await fetch_chat_data_by_room_id(1,
        `${sender_email}_%_%#%_%_${receiver_email}`,
            sender_email,
            receiver_email
    );

    test(receiver_email)

    set_message_loading(false);
    if(chat_container_ref.current){
      chat_container_ref.current.style.scrollBehavior = 'auto';
      setTimeout(() => {
        if(chat_container_ref.current){
        chat_container_ref.current.style.scrollBehavior = 'smooth';
        }
      }, 100);
    }
 }

// active user list
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
     is_pin_top,new_message,user_set_profile,last_active_time
 })=>{

  const imageSrc = user_set_profile ? user_set_profile : user_profile_icon;

  let set_time = null
  if (last_active_time){
    set_time = format_date_time(last_active_time);
  }

     return(
       
         <div className={`item_con ${is_chat_on && 'active'}`} 
                 onClick={()=>{set_me_as_active_chat_room(sender_email,receiver_email);
                     }}>
             <div className="profile_pic">
             <img src={imageSrc} alt="User Profile"/>
             </div>
             <div className="user_data">
                 <div className="user_data_1">
                     <div className="profile_name">{reverser_user_name}</div>
                     <div className="last_message_time">

                     {set_time &&
                            (set_time.is_more_than_12_hr ? set_time.date : set_time.time)
                        }

                     </div>
                 </div>
                 <div className="user_data_2">
                  {list_of_active_user.includes(receiver_email) ? 
                              <div className="info">
                                <div className="dot"></div>
                                  Online
                                </div>
                  :
                    set_time ?
                      <div className="last_message_info">
                        <div className="time">
                        Last active {` `}
                     {set_time &&
                            (set_time.is_more_than_12_hr ? set_time.date : set_time.time)
                        }
                        </div>
                        </div>  
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

 useEffect(()=>{
  socket.on("send_me_as_read",(data)=>{
    if(data.sender_email === current_active_room_data.active_email){
      set_read_mes_id_list((prevList) => [
        ...prevList,
        ...(Array.isArray(data.list_of_updated_id) ? data.list_of_updated_id : [data.list_of_updated_id])
    ]);
    


    }
  })

  return(()=>{
    socket.off("send_me_as_read")
  })
 },[current_active_room_data.active_email])


 const handleRightClick = (event) => {
  event.preventDefault();
  

  const menuHeight = 400;
  const menuWidth = 350; 
  const { innerWidth, innerHeight } = window;
  
  const x = (event.pageX + menuWidth > innerWidth) 
    ? innerWidth - menuWidth 
    : event.pageX;

  const y = (event.pageY + menuHeight > innerHeight) 
    ? innerHeight - menuHeight 
    : event.pageY;

  set_show_right_click_menu_position({x,y });
  set_show_right_click_menu(true)
};

 // sub part of Chat ui

 // sub part of Chat ui --- >  show new message pip
 const ShowNewMessage = ({ Email, message }) => {
    const sub_data = get_user_data_by_email(Email)
     return (
       <>
         <div
           className={`show_user_new_message_con ${
             is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'
           }`}

           onClick={()=>{
            set_active_page("Chats");
            set_show_full_menu(false);
            set_me_as_active_chat_room(user_data_email,Email);
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
             <img src={sub_data.profile_image || profile_icon} alt="" />
             <div className="data">
               <p>{Email}</p>
               <span>{message}</span>
             </div>
           </div>
         </div>
       </>
     );
   };

// right click menu
   const RightClickMenu = () =>{
    return (
      <div id='right_click_menu' onClick={()=>{set_show_right_click_menu(false)}}>
        <div className="right_menu" style={{
        top: show_right_click_menu_position.y,
        left: show_right_click_menu_position.x,
      }} onClick={(e)=> e.stopPropagation()}
          >
          Developer will work on this menu
        </div>
      </div>
    )

   }
   
   const ChatPinMenu = () => {
     const video_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/video.png`);
     const chat_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/chat.png`);
     const file_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/new-document.png`);
     const user_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/user-v2.png`);
     const poll_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/poll.png`);
     const add_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/plus.png`);
   
     const [show_select_img_ls, set_show_select_img_ls] = useState(false);
     const [sender_imgs, set_sender_imgs] = useState([]);
     const [as_active_img, set_as_active_img] = useState(0);
     const bottomPrvRef = useRef(null);
     const [show_camera_capture,set_show_camera_capture] = useState(false)
     const [text_for_img,set_text_for_img] = useState('')

     const handleImageChange = (e) => {
       const files = Array.from(e.target.files);
       const newImages = files.map((file) => ({
         file,
         previewUrl: URL.createObjectURL(file),
       }));
       set_sender_imgs((prevImages) => [...prevImages, ...newImages]);
       set_show_select_img_ls(true)
     };
   
     const handleScroll = (event) => {
       if (bottomPrvRef.current && event.deltaY !== 0) {
         bottomPrvRef.current.scrollLeft += event.deltaY * 3;
         event.preventDefault();
       }
     };
   
     const remove_by_index = (index) => {
       set_sender_imgs((prevImgs) => prevImgs.filter((_, i) => i !== index));
       set_as_active_img(0);
     };
   
     const convertToBase64 = (file) => {
       return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => {
           const base64 = reader.result.split(',')[1]; 
           resolve(base64);
         };
         reader.onerror = (error) => {
           reject(error);
         };
       });
     };
   
     const handleSubmit = async (event) => {
       event.preventDefault();

       let chatImgBase64 = null;
       if (sender_imgs[0] && sender_imgs[0].file) {
         try {
           chatImgBase64 = await convertToBase64(sender_imgs[0].file);
         } catch (error) {
           console.error('Error converting image to Base64:', error);
           return;
         }
       }
       try {
         const response = await fetch('https://test-node-90rz.onrender.com/api/add_chat', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             chat_id: current_active_room_id,
             receiver_email: current_active_room_data.active_email,
             sender_email: user_data_email,
             message: text_for_img,
             send_time: new Date().toISOString(),
             chat_img: chatImgBase64,
           }),
         });
   
         if (!response.ok) {
           throw new Error(`Error: ${response.statusText}`);
         }
   
        //  const data = await response.json();
         set_sender_imgs([]);
       } catch (error) {
         console.error('Error sending chat message:', error);
         set_sender_imgs([]);
       }
     };
   
     return (
       <div id="ChatPinMenu" onClick={()=>{set_show_pin_menu(false)}}>
       {show_camera_capture && 
        <CameraCapture  is_dark_mode={is_dark_mode} 
          file_clsoe_fun={()=>{set_show_camera_capture(false)}}
          sending_email={current_active_room_data.active_email}
          current_active_room_id={current_active_room_id}
          current_active_room_data={current_active_room_data}
          user_data_email={user_data_email}

        />}
        <input id='add_img_to_box_menu' style={{ display: "none" }} onClick={(e)=>{e.stopPropagation()}}
               type="file" accept="image/*" multiple onChange={handleImageChange} />


         <div className={`main_div ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`} 
            onClick={(e) => { e.stopPropagation();}}  >

           <label htmlFor='add_img_to_box_menu'>
             <img src={chat_menu_icon} alt="" />
             <span className={`text ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>Photos & videos</span>
           </label>
           <button onClick={()=>{set_show_camera_capture(true)}} >
             <img src={video_menu_icon} alt=""/>
             <span className={`text ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>Camera</span>
           </button>
           <button>
             <img src={file_menu_icon} alt="" />
             <span className={`text ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>Document</span>
           </button>
           <button>
             <img src={user_menu_icon} alt="" />
             <span className={`text ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>Contact</span>
           </button>
           <button>
             <img src={poll_menu_icon} alt="" />
             <span className={`text ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>Poll</span>
           </button>
         </div>
   
         {show_select_img_ls &&
           <div className={`show_selected_img ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}
             onClick={(e) => { e.stopPropagation(); }}>
   

   
             <div className="top_menu_bar">
             </div>
             <div className="main_img_pr">
               <div className="main_prv">
                 {sender_imgs[as_active_img] && (
                   <>
                     <div className="remove_button">
                       <img src={cancel_icon} alt="" onClick={() => { remove_by_index(as_active_img) }} />
                     </div>
                     <img src={sender_imgs[as_active_img].previewUrl} alt="Preview_main" />
                   </>
                 )}
               </div>
               <div ref={bottomPrvRef} className="bottom_prv" onWheel={handleScroll}>
                 {sender_imgs.map((image, index) => (
                   <img key={index} src={image.previewUrl} alt={`Preview ${index + 1}`}
                     onClick={() => { set_as_active_img(index) }}
                     className={as_active_img === index && 'active'}
                   />
                 ))}
                 <label htmlFor='add_img_to_box_menu' className="add_more_con">
                   <img src={add_menu_icon} alt="" />
                 </label>
               </div>
             </div>
   
             <div className="bottom_menu_con">
               <div className="input_s">
                 <input type="text" 
                 onChange={(e)=>{set_text_for_img(e.target.value)}}
                 value={text_for_img}
                 placeholder='Add message' className={`${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`} />
               </div>
               <div className="last_op" onClick={(e)=>{
                handleSubmit(e);
               }}>
                 <img src={send_icon} alt="" />
               </div>
             </div>
           </div>
         }

 

       </div>
     );
   };
   

  
  return (
    <div id="home_page" className={is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}>
      {show_question_menu &&  <ShowQuestionPop
      is_dark_mode={is_dark_mode}
        title={show_question_menu_data.title}
        message={show_question_menu_data.message}
        no_button_fun={show_question_menu_data.no_button_fun}
        yes_button_fun={show_question_menu_data.yes_button_fun}
      />}

      {show_active_user_info_pop  && <ChatUserProfile   
        file_close_funtion={()=>{set_show_active_user_info_pop(false)}}
        set_dark_mode={is_dark_mode}
        user_name={current_active_room_data.active_user_name}
        user_about={current_active_room_data.active_user_about}
        user_email={current_active_room_data.active_email}
        user_profile={current_active_room_data.active_profile_img}
        active_user_email={user_data_email}
        fetch_all_data_user_fun={()=>{fetch_users_data(user_data_email)}}
      />}

      {show_right_click_menu && <RightClickMenu/>}

      {show_new_message_con && <ShowNewMessage 
          Email={show_new_message_data.new_message_email} 
          message={show_new_message_data.new_message_message}           
          />}


      {full_img_view &&  <FullImgView
          is_dark_mode={is_dark_mode}
          show_bottom_list={full_img_data.show_bottom_list}
          show_full_menu={full_img_data.show_full_menu}
          main_img_to_show={full_img_data.main_img_to_show}
          file_close_function={full_img_data.file_close_function}
        />}


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
          <div className={`menu_item_con ${active_page === 'Starred messages' && 'active'}`} onClick={()=>{
                set_active_page("Starred messages");set_show_full_menu(false);
                set_show_question_menu_data({
                  title:'Apply new theme?',
                  message:'whatsApp will need to restart to apply new theme.',
                  no_button_fun:()=>{set_show_question_menu(false)},
                  yes_button_fun:()=>{set_show_question_menu(false)}
                })
                set_show_question_menu(true)
                
                }}>
            <img src={star_menu_icon} alt="" />
            <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Starred messages</p>
          </div>
          <div className={`menu_item_con ${active_page === 'Archived chats' && 'active'}`} onClick={()=>{set_active_page("Archived chats");set_show_full_menu(false)}}>
            <img src={archive_menu_icon} alt="" />
            <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Archived chats</p>
          </div>
          <div className="line_div"></div>
          <div className="menu_item_con" onClick={()=>{ set_show_sub_pop_menu({show_pop:true,pop_data:'General'})}}>
            <img src={setting_menu_icon} alt="" />
            <p className={show_full_menu ? 'menu_name' : 'menu_name hidden'}>Settings</p>
          </div>
          <div className="menu_item_con_2" onClick={()=>{ set_show_sub_pop_menu({show_pop:true,pop_data:'Profile'})}}>
              <div className="profile_img">
              <img  src={user_data_profile_img ? `${user_data_profile_img}` : user_profile_icon}  alt="" />
              </div>
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
                <img src={menu_icon} alt="" />
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
              is_chat_on={current_active_room_data.active_user_name===user.username}
                receiver_email={user.email} sender_email={user_data_email} reverser_user_name={user.username}
                user_profile={profile_icon} is_pin_top={false} new_message={0} 
                user_set_profile={user.profile_image}
                last_active_time={user.last_active_time}
                />
              )
              ))}

            </div>
          </div>

          <div className="active_chat">
            {current_active_room_data.active_user_name ?
            <>
              {/* active_chat > top profile part */}
              <div className={`user_top_data ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}
              onClick={()=>{set_show_active_user_info_pop(true)}}
              >
                <div className="profile_pic">
                  <img src={current_active_room_data.active_profile_img ? current_active_room_data.active_profile_img : profile_icon} alt="" />
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
                      :
                      userStatus==='Offline' ?
                          get_last_active_time() :
                          <>
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
              <div ref={chat_container_ref} className={`main_chat ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode'}`}
              onWheel={handleScroll} // Use onWheel to detect scrolling
                >

{!isAtBottom && (
        <div 
          className={`go_end_button ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`} 
          onClick={scrollToBottom}
        >
          <img src={back_icon} alt="Go to bottom" />
        </div>
      )}



                  <div className='message_box_server'>
                                    <div className={`server_message_con ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                                        <div className="text">
                                            Messages and calls are end-to-end encrypted. No one outside of this chat, not even Chat x, can read or listen to them.
                                        </div>
                                    </div>
                  </div>
                  {!message_loading && 
                  
                  <div className="set_next_page_button">
                  {next_page_button ?
                  message_sub_loading ?
                    <div id="message_loading_chat">
                        <div className="loader"></div>
                        <div className="loading-text">Loading, please wait...</div>
                    </div>
                  :
                    <button onClick={fetch_Next_Page}>
                        Load More Messages
                    </button>

                :
                <p>No more message</p>  
                }
                  </div>
                }

                {message_loading ? (

<div id="message_loading_chat">
    <div className="loader"></div>
    <div className="loading-text">Loading, please wait...</div>
</div>
                ) : (

                    reverser_messages.map((msg, index) => {
                        const {
                            _id,
                            is_in_chat_img: is_chat,
                            chat_img_src: chat_url,
                            message,
                            send_time: time,
                            receiver_email: send_by_email,
                            is_read
                        } = msg;
                        
                      
                        const message_time = format_date_time(time);
                        const is_server_message = false;
                        const current_user_email = user_data_email;
                      
                        const messageBoxClass = (is_chat && send_by_email === current_user_email)
                            ? 'message_box_img_receiving'
                            : (is_chat ? 'message_box_img_sender' : (send_by_email === current_user_email ? 'message_box_receiving' : 'message_box_sending'));
                      
                        const renderImage = () => (
                            <img
                                src={chat_url}
                                alt="chat set"
                                onClick={() => {
                                    set_full_img_data({
                                        show_bottom_list: false,
                                        show_full_menu: true,
                                        main_img_to_show: chat_url,
                                        all_bottom_list: false,
                                        file_close_function: () => set_full_img_view(false),
                                    });
                                    set_full_img_view(true);
                                }}
                            />
                        );
                      
                        if (is_server_message) {
                            return (
                                <div className='message_box_server' key={index}>
                                    <div className={`server_message_con ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                                        <div className="text">
                                            Messages and calls are end-to-end encrypted. No one outside of this chat, not even Chat x, can read or listen to them.
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                      
                        if (is_chat) {
                            return (
                                <div className={messageBoxClass} key={index} 
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  handleRightClick(e);
                              }}>
                                    <div className={`img_con ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                                        {renderImage()}
                                        {message && <div className="message">{message}</div>}
                                    <div className="time">{message_time.time}</div>
                                    </div>
                                </div>
                            );
                        }
                      
                        return (
                            <div className={messageBoxClass} key={index} onContextMenu={(e) => {
                                e.preventDefault();
                                handleRightClick(e);
                            }}>
                                <div className={`text ${send_by_email === current_user_email ? 'receiving_con' : 'sending_con'} ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                                    <div className="text">{message}</div>
                                    <div className="time">
                                      {message_time.time}
                                      

                                      {
                                        send_by_email !== current_user_email 
                                          && (is_read ? <img src={tick_true_icon} alt="Message read" /> 
                                            
                                            :
                                            read_mes_id_list.includes(_id) 
                                            ? <img src={tick_true_icon} alt="Message read" /> 
                                            : <img src={tick_icon} alt="Message not read" />
                                            )
                                      }

                                      
                                    </div>
                                    
                                </div>
                            </div>
                        );
                    })
                )}




                {show_emoji_piker &&
                <>
                  <div className='emoji_box_con' onClick={()=>{set_show_emoji_piker(false)}}> </div>
                  <div className="emoji_box">
                    <EmojiPicker onEmojiClick={(emojiObject)=>{set_input_message(prevInput => prevInput + emojiObject.emoji);}} />
                  </div>
                </>
                }

          {show_pin_menu && <ChatPinMenu/>}
              </div>

              {/* active_chat > bottom input */}
              <div className={`user_bottom_input ${is_dark_mode==='Light' ? 'light_mode' : 'dark_mode' }`}>

                <div className="menu_item">
                  <img src={happiness_icon} alt="Happiness" onClick={()=>{set_show_emoji_piker(true)}} />
                  <img src={attach_file_icon} alt="Attach" onClick={()=>{set_show_pin_menu(true)}} />
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
    {active_page === 'Calls' && <CallsForHome set_dark_mode={is_dark_mode} user_data_email={user_data_email}
      list_of_users={list_of_users}
      set_list_of_users={set_list_of_users}
    />}
    {active_page === 'Status' && <>
      <h2>This is the home page</h2>
      <h3>Email: {user_data_email}</h3>
      <h3>Username: {user_data_user_name}</h3>
      <h3>Password: {user_data_password}</h3>
    </>}
    </div>
    {show_sub_pop_menu.show_pop 
      && <HomePageSubMenu 
          //user profile
          set_user_data_profile_img={set_user_data_profile_img}
          user_data_profile_img={user_data_profile_img}
          // 
          
          fetch_all_data_user_fun={()=>{fetch_users_data(user_data_email)}}



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
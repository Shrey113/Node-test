import {React,useState,useRef, useEffect} from 'react'
import '../css_files/HomePageSubMenu.css'
import FullImgView from './FullImgView';
import ShowQuestionPop from './ShowQuestionPop';

import { client_data,update_client_data} from './../Clint_data';


function HomePageSubMenu({file_close_funtion,dark_mode_stat,set_me_on_open_menu,
    toggle_light_and_dark_mode,logout_user,

    set_user_data_profile_img,user_data_profile_img,

    fetch_all_data_user_fun
}) {
    

    const [active_page,set_active_page] = useState(`${set_me_on_open_menu ? set_me_on_open_menu : "General" }`)

    const user_profile_icon = require(`../Data/Home_page_data/${dark_mode_stat}/profile_icon.png`);
    
    const personalization_icon = require(`../Data/Home_page_data/${dark_mode_stat}/personalization.png`);
    const technology_icon = require(`../Data/Home_page_data/${dark_mode_stat}/technology.png`);
    const Account_icon = require(`../Data/Home_page_data/${dark_mode_stat}/key.png`);
    const chat_icon = require(`../Data/Home_page_data/${dark_mode_stat}/chat.png`);
    const notification_icon = require(`../Data/Home_page_data/${dark_mode_stat}/notification.png`);
    const Help_icon = require(`../Data/Home_page_data/${dark_mode_stat}/info.png`);
    
        



    const [show_question_menu,set_show_question_menu] = useState(false);
    const [show_question_menu_data,set_show_question_menu_data] = useState({
      title:'',
      message:'',
      no_button_fun:null,
      yes_button_fun:null,
  
    });



const [user_old_data_email, set_user_old_data_email] = useState('');
const ProfileInfo = ()=>{
    const profile_icon = require(`../Data/Home_page_data/${dark_mode_stat}/user.png`);
    const pen_icon = require(`../Data/Home_page_data/${dark_mode_stat}/pen.png`);
    const pen_icon_not_dark = require(`../Data/Home_page_data/${dark_mode_stat === 'Dark' ? 'Light' : 'Dark'}/pen.png`);
    const save_icon = require(`../Data/Home_page_data/${dark_mode_stat}/diskette.png`);


    
    const [user_old_data_user_name, set_user_old_data_user_name] = useState('');
    const [user_old_data_user_About, set_user_old_data_user_About] = useState('');
    const [user_old_data_password, set_user_old_data_password] = useState('');


    const[user_name,set_user_name] = useState('')
    const[user_About,set_user_About] = useState('')
    const[user_email,set_user_email] = useState('')


    const[edit_name_pen,set_edit_name_pen] = useState(false)
    const[edit_About_pen,set_edit_About_pen] = useState(false)
    const[edit_email_pen,set_edit_email_pen] = useState(false)


    const user_name_Ref = useRef(null);
    const user_About_Ref = useRef(null);
    const user_email_Ref = useRef(null);

    const [show_profile_pop,set_show_profile_pop] = useState(false);
      
   
    async function remove_profile_image(email) {
        try {
          const response = await fetch('https://test-node-90rz.onrender.com/remove_profile_img', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error removing profile image');
          }
      
          const data = await response.json();
          if(data.message === 'Profile image removed successfully'){
            set_user_data_profile_img(false)
            set_show_profile_pop(false)
          }else{
            alert("remove profile Error")
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
      

        useEffect(()=>{
            let user_email =client_data.email
            
            set_user_old_data_email(user_email);
            set_user_old_data_user_name(client_data.username);
            set_user_old_data_user_About(client_data.about_user);
            set_user_old_data_password(client_data.password);
            // copy - 2
            set_user_name(client_data.username);
            set_user_email(user_email);
            set_user_About(client_data.about_user);

            set_edit_name_pen(false)
            set_edit_About_pen(false)
            set_edit_email_pen(false)
        },[])
  
        async function updateUser(data,update_key) {
            try {
              const response = await fetch('https://test-node-90rz.onrender.com/update-user', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
          
              if (!response.ok) {
                throw new Error(`Failed to update user: ${response.statusText}`);
              }

              const updatedUser = await response.json();
              if(update_key === "username"){
                await update_client_data(update_key,updatedUser.username)
                set_user_old_data_user_name(client_data.username);
                set_user_name(client_data.username);
              }
              if(update_key === "about_user"){
                await update_client_data(update_key,updatedUser.about_user);
                set_user_old_data_user_About(client_data.about_user);
                set_user_About(client_data.about_user);
              }
            } catch (error) {
              console.error('Error updating user:', error);
            }
          }
          


//  for get and set file - 1
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
//  for get and set file - 2      
      const handle_image_upload_profile = async (event, email) => {
        const file = event.target.files[0];
    
        if (email !== user_old_data_email) {
            alert("Email ID must be verified");
            return;
        }
    
        if (file) {
            try {
                const base64Image = await convertToBase64(file);
                
                const response = await fetch('https://test-node-90rz.onrender.com/uploads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ img: base64Image, email }),
                });
    
                const data = await response.json();
    
                if (data.message === 'Profile image updated successfully') {
                    await update_client_data("profile_image",data.user.profile_image)
                    set_user_data_profile_img(client_data.profile_image_url);
                } else {
                    console.error('Error uploading image:', data.message);
                }
            } catch (error) {
                console.error('Error during image upload:', error);
            }
        }
    };
    



    const [show_full_user_profile,set_show_full_user_profile] = useState(false);
      

    return(
        <div className={`sub_info ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`} >



        {show_full_user_profile &&  <FullImgView 
                is_dark_mode={dark_mode_stat}
                file_close_function={()=>{set_show_full_user_profile(false)}} 
                main_img_to_show={user_data_profile_img}
                show_bottom_list={false}
                show_full_menu={false}
                  />}

        <div className="info_title">{active_page}</div>
        <div className="info_data">

            <div className="profile_con" onMouseLeave={()=>{set_show_profile_pop(false)}}>
                    <input type="file" accept='image/*' onChange={(e)=>{handle_image_upload_profile(e,user_email)}}
                             id="handel_img_input" style={{display:"none"}} />

                        {user_data_profile_img ?
                            <img src={user_data_profile_img} className='profile' alt="" onMouseEnter={()=>{set_show_profile_pop(true)}} />
                            :
                            <img src={profile_icon} className='profile' alt="" onMouseEnter={()=>{set_show_profile_pop(true)}} />
                        }
                    {show_profile_pop &&
                        <label htmlFor="handel_img_input" className="edit_profile">
                                <img src={pen_icon_not_dark}  alt=""  />
                        </label>
                    }
                {show_profile_pop  && user_data_profile_img &&
                    <div className={`sub_menu`}>
                        <div className={`sub_menu_con ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                            <span onClick={()=>{remove_profile_image(user_old_data_email)}} >
                                Remove image
                            </span>
                            <span onClick={()=>{set_show_full_user_profile(true)}}>
                                View image
                            </span> 
                            <label htmlFor="handel_img_input">
                                Charge image
                            </label>
                        </div>
                    </div>
                }

            </div>
            {/* input == Name */}
            <div className="item_pen_con">
                <div className="data">
                    <input ref={user_name_Ref} type="text" value={user_name} onChange={(e)=>{set_user_name(e.target.value)}} 
                        className={` ${edit_name_pen && 'active'} ${dark_mode_stat === 'Light' ? 'set_Light_input' : 'set_dark_input'}`} 
                        readOnly={!edit_name_pen} onBlur={()=>{set_edit_name_pen(false)}}/>
                </div>
                {user_old_data_user_name === user_name ?
                    <img className='pen' src={pen_icon} alt="" onClick={()=>{ set_edit_name_pen(!edit_name_pen);
                        setTimeout(() => {user_name_Ref.current.focus()}, 300);
                    }} />
                     :
                     <img src={save_icon} alt="" 
                     onClick={()=>{ updateUser({ email:user_old_data_email,username:user_name,},"username");
                        }}/>
                }
            </div>

            {/* textarea == about */}
            <div className="item_pen_con">
                <div className="data">
                    <div className="title">About</div>                    
                    <textarea ref={user_About_Ref} value={user_About} onChange={(e)=>{set_user_About(e.target.value);}}
                            className={` ${edit_About_pen && 'active'} ${dark_mode_stat === 'Light' ? 'set_Light_input' : 'set_dark_input'}`}
                            style={{height: `${Math.max(40, user_About.split('\n').length * 24)}px`,}} onBlur={()=>{set_edit_About_pen(false)}} 
                            placeholder='Add about you'/>
                </div>
                {user_old_data_user_About === user_About ?
                <img src={pen_icon} alt="" onClick={()=>{set_edit_About_pen(true);
                    setTimeout(() => {user_About_Ref.current.focus()}, 300);}} />
                :
                <img src={save_icon} alt="" 
                onClick={()=>{ updateUser({email:user_old_data_email,about_user:user_About},"about_user");
                   }}/>
                }
            </div>
            
            {/* input == email */}
            <div className="item_pen_con">
                <div className="data">
                    <div className="title">Email ID</div>
                    <input ref={user_email_Ref} type="text" value={user_email} onChange={(e)=>{set_user_email(e.target.value)}} 
                        className={`  ${edit_email_pen && 'active'} ${dark_mode_stat === 'Light' ? 'set_Light_input' : 'set_dark_input'}`} 
                        readOnly={!edit_email_pen} onBlur={()=>{set_edit_email_pen(false)}}/>
                </div>
                {user_old_data_email === user_email ?
                <img className='pen' src={pen_icon} alt="" onClick={()=>{set_edit_email_pen(true);
                    setTimeout(() => {user_email_Ref.current.focus()}, 300);}} /> 
                :<span>verfy email</span>
                }
            </div>

            <div className="line_div"></div>
            <div className="last_message">
                <div className="buttons_con">
                    <button onClick={()=>{

                    set_show_question_menu(true)
                    set_show_question_menu_data({
                        title:"Are you sure logout?",
                        message:``,
                        no_button_fun:()=>{set_show_question_menu(false)},
                        yes_button_fun:()=>{
                            set_show_question_menu(false)
                            logout_user();
                        }
                    })

                    }


                    } className={`button_log_out ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                        Log out
                    </button>
                    <button onClick={logout_user} className={`change_password ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                        Change  Password
                    </button>
                </div>
                <p> Chat history on this computer will be Not cleared when log out</p>
            </div>

            <h2>Test data :</h2>
            <br />        
            <p>Password: {user_old_data_password}</p>

        </div>
    </div>
    )
}

const GeneralInfo = ()=>{

    const [block_list,set_block_list] = useState([])

    useEffect(()=>{
        set_block_list(client_data.block_list)
    },[])

    function un_block(email){
        fetch('https://test-node-90rz.onrender.com/unblock_user_by_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email:user_old_data_email ,
                unblock_email:email })
        }).then(response=> response.json).then(data => {
            fetch_all_data_user_fun()
            set_block_list(data.data_list);
            update_client_data("block_by_users",data.data_list);
        })
    }
    return(
        <div className={`sub_info ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`}>
            <div className="info_title">{active_page}</div>
            <div className="info_data">

                <div className="line_div"></div>
                <div className="title">block list Email</div>
                <div className="block_list_email">
                {
                  block_list && block_list.length > 0 ? (
                    block_list.map((email) => (
                      <div key={email} className="email_con">
                        <p>{email}</p>
                        <span onClick={()=>{
                              set_show_question_menu_data({
                                title:"Are you sure?",
                                message:`you won't un block ${email}`,
                                no_button_fun:()=>{set_show_question_menu(false)},
                                yes_button_fun:()=>{
                                    un_block(email);
                                    set_show_question_menu(false);
                                }
                            })
                            set_show_question_menu(true);
                        }}>Un Block</span>
                      </div>
                    ))
                  ) : (
                    <p>No blocked emails found</p>
                  )
                }


                </div>

                <div className="line_div"></div>
                <div className="title">Chat X privacy</div>
                <p>Blocking this user means they will no longer have access to your profile and data within the app.</p>
            </div>
        </div>
    )
}



  return (
    
    <div id='HomePageSubMenu' onClick={()=>{file_close_funtion({show_pop:false,pop_data:''})}}>
{show_question_menu && 
      <ShowQuestionPop
        title={show_question_menu_data.title}
        message={show_question_menu_data.message}
        no_button_fun={show_question_menu_data.no_button_fun}
        yes_button_fun={show_question_menu_data.yes_button_fun}
      />
      }
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
            {active_page === 'Profile' && <ProfileInfo/>}
            {active_page === 'Account' && <GeneralInfo/>}
            {active_page !== 'Profile' && active_page !== 'Account'  && 

                        <div className={`sub_info ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`}>
                        <div className="info_title">{active_page}</div>
                        <div className="info_data">
                        <br />
                    This  features are not avilable for now!<br/>Next version have a this  features
                    <br />
                    <br />
                    <br />
        
                    <br />
                    <button onClick={toggle_light_and_dark_mode}>Toggle Dark-Light</button>
                    
                        </div>
                    </div>
            }

            
        </div>

      </div>
    </div>
  )
}

export default HomePageSubMenu

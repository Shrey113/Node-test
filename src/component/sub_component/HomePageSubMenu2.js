import {React,useState} from 'react'
import '../css_files/ChatUserProfile.css'
import FullImgView from './FullImgView';
import ShowQuestionPop from './ShowQuestionPop';




function ChatUserProfile({file_close_funtion,set_dark_mode,active_user_email,
    user_name,user_about,user_email,user_profile,

    fetch_all_data_user_fun
}) {
    
    let dark_mode_stat = set_dark_mode || 'Dark';
    const [active_page,set_active_page] = useState("Overview")


    const profile_icon = require(`../Data/Home_page_data/${dark_mode_stat}/user.png`);
    const unlock_icon = require(`../Data/Home_page_data/${dark_mode_stat}/unlock.png`);
    const entertainment_icon = require(`../Data/Home_page_data/${dark_mode_stat}/entertainment.png`);
    const info_icon = require(`../Data/Home_page_data/${dark_mode_stat}/info.png`);
    const file_icon = require(`../Data/Home_page_data/${dark_mode_stat}/new-document.png`);
    const link_icon = require(`../Data/Home_page_data/${dark_mode_stat}/link.png`);
    const video_icon = require(`../Data/Home_page_data/${dark_mode_stat}/video.png`);
    const call_icon = require(`../Data/Home_page_data/${dark_mode_stat}/telephone.png`);

    const [show_full_user_profile,set_show_full_user_profile] = useState(false);

    const [show_question_menu,set_show_question_menu] = useState(false);
    const [show_question_menu_data,set_show_question_menu_data] = useState({
      title:'',
      message:'',
      no_button_fun:null,
      yes_button_fun:null,
  
    });


    function block_user_by_email(email, block_email) {        
        fetch("http://localhost:4000/block_user_by_email", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                block_email: block_email
            })
        })
        .then((response) => response.json())
        .then((data) => {
            fetch_all_data_user_fun()
        })
        .catch((error) => {
            console.error("Error blocking user:", error);
        });
    }
    
    

  return (
    
    <div id='ChatUserProfile' onClick={file_close_funtion}>

{show_question_menu && 
      <ShowQuestionPop
      is_dark_mode={dark_mode_stat}
        title={show_question_menu_data.title}
        message={show_question_menu_data.message}
        no_button_fun={show_question_menu_data.no_button_fun}
        yes_button_fun={show_question_menu_data.yes_button_fun}
      />
      }



        {show_full_user_profile &&  <FullImgView 
                is_dark_mode={set_dark_mode}
                file_close_function={()=>{set_show_full_user_profile(false)}} 
                main_img_to_show={user_profile}
                show_bottom_list={false}
                show_full_menu={false}
                  />}
        
      
      <div className={`user_sub_menu ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`} onClick={(e)=>{e.stopPropagation()}}>

        <div className="side_menu">
            <div className="top_sub_menu_part">
                <div className={`menu_item_con ${active_page === 'Overview' && 'active'}`} onClick={()=>{set_active_page("Overview")}}>
                    <img src={info_icon} alt="" />
                    <p className="menu_name">Overview</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Media' && 'active'}`} onClick={()=>{set_active_page("Media")}}>
                    <img src={entertainment_icon} alt="" />
                    <p className="menu_name">Media</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Files' && 'active'}`}  onClick={()=>{set_active_page("Files")}}>
                    <img src={file_icon} alt="" />
                    <p className="menu_name">Files</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Link' && 'active'}`}  onClick={()=>{set_active_page("Link")}}>
                    <img src={link_icon} alt="" />
                    <p className="menu_name">Link</p>
                </div>
                <div className={`menu_item_con ${active_page === 'Encryption' && 'active'}`}  onClick={()=>{set_active_page("Encryption")}}>
                    <img src={unlock_icon} alt="" />
                    <p className="menu_name">Encryption</p>
                </div>
            </div>
        </div>
        <div className="info_section">
          <div  className={`sub_info ${dark_mode_stat === 'Light' ? 'light_mode' : 'dark_mode'}`}>
            <div className="info_title">{active_page}</div>
            {active_page === 'Overview' &&             
            <div className="info_data">
                {user_profile ?                 
                <div className="profile_con" onClick={()=>{set_show_full_user_profile(true)}}>
                    <img src={user_profile} className='profile' alt=""/>
                </div>
                :
                <div className="profile_con" style={{cursor:"default"}}>
                    <img src={profile_icon} className='profile' alt=""/>
                </div>
            }


                <div className="user_name">
                    {user_name || 'None'}
                <div className="user_name_2">
                    ~ {user_name || 'None'}
                </div>
                </div>


                <div className="call_option">
                    <div className="op">
                        <img src={video_icon} alt="" />
                        <p>Video</p>
                    </div>
                    <div className="op">
                        <img src={call_icon} alt="" />
                        <p>Voice</p>
                    </div>
                </div>

                <div className="item_menu">
                    <div className="title">About</div>
                    <div className="data">{user_about || '.'}</div>
                </div>
                <div className="item_menu">
                    <div className="title">Email id</div>
                    <div className="data">{user_email || '.'}</div>
                </div>

                <div className="button_con">
                    <button onClick={()=>{
                         
                        set_show_question_menu_data({
                            title:"Are you sure?",
                            message:`you won't block ${user_email}`,
                            no_button_fun:()=>{set_show_question_menu(false)},
                            yes_button_fun:()=>{
                                block_user_by_email(active_user_email,user_email);
                                set_show_question_menu(false);
                                
                            }
                        })

                        set_show_question_menu(true);
                    
                    }
                        
                        } >block</button>
                </div>
            </div>
            }

            {active_page === 'Encryption' &&             
            <div className="info_data">
                <p className='Encryption_info_1'>Every WhatsApp message is protected by the same Signal encryption protocol that secures messages before they leave your device. When you message a WhatsApp business account, 
                    <br />
                    <br />
                    your message is delivered securely to the destination chosen by the business.
                        <br />
                        <a href="https://faq.whatsapp.com/820124435853543/?helpref=uf_share" >Learn more</a>
                        
                    

                </p>
                <br />
                <span className='Encryption_info_2'>Create by @Shrey11_</span>
            </div>
            }

        {active_page === 'Media' &&   <div className="info_data">Not fond any {active_page} on this chat</div>}
        {active_page === 'Files' &&   <div className="info_data">Not fond any {active_page} on this chat</div>}
        {active_page === 'Link' &&   <div className="info_data">Not fond any {active_page} on this chat</div>}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChatUserProfile

import {React,useRef, useState} from 'react';
import './css_files/LoginRegister.css';
import login_main_svg from './Data/mobile-chatting-app.png';
import login_main_logo from './Data/web_site_logo.png';
import close_button from './Data/close.png';
import visible_icon from './Data/visible.png';
import hide_icon from './Data/hide.png';
import back_icon from './Data/back.png';
import refresh from './Data/refresh.png';
import ShowLoder from './sub_component/show_loder'
import ForgotPassword from './sub_component/ForgotPassword'

function LoginRegister() {
  // IMP Data
  const localstorage_key_for_jwt_user_side_key = 'Jwt_user_localstorage_key_on_chat_x'
  const[show_form_loder,set_show_form_loder] = useState(false)

  // All pop menu
  const [show_login_pop_menu, set_show_login_pop_menu] = useState(false);
  const [is_show_forgot_page,set_is_show_forgot_page] = useState(false)
  
  // Login Part  ------------------------------------------------------------------------------------------------------------
  const [is_login_page, set_is_login_page] = useState(true);
  const [is_password_visible, set_is_password_visible] = useState(false);

  // login input value and error
  const [login_email, set_login_email] = useState('');
  const [login_password, set_login_password] = useState('');
  const [login_email_error, set_login_email_error] = useState('');
  const [login_password_error, set_login_password_error] = useState('');

  // sign up  ------------------------------------------------------------------------------------------------------------
  const [is_Sign_up_password_visible, set_is_Sign_up_password_visible] = useState(false);
  const [is_Sign_up_Conform_password_visible, set_is_Sign_up_Conform_password_visible] = useState(false);

  // signup States value and error
  const [signup_email, set_signup_email] = useState('');
  const [signup_OTP, set_signup_OTP] = useState('');
  const [signup_user_name, set_signup_user_name] = useState('');
  const [signup_password, set_signup_password] = useState('');
  const [signup_Conform_password, set_signup_Conform_password] = useState('');
  const [signup_email_error, set_signup_email_error] = useState('');
  const [signup_OTP_error, set_signup_OTP_error] = useState('');
  const [signup_user_name_error, set_signup_user_name_error] = useState('');
  const [signup_password_error, set_signup_password_error] = useState('');
  const [signup_Conform_password_error, set_signup_Conform_password_error] = useState('');

  // ohter for 'LoginRegister'
  const [OTP_verify, set_OTP_verify] = useState(false);
  const [is_OTP_send_to_clint, set_is_OTP_send_to_clint] = useState(false);
  const[OTP_resend_time,set_OTP_resend_time] = useState(40);
  const[show_resend_button,set_show_resend_button] = useState(false);
  const timer_for_resend_OTP = useRef(null);


  // start timer for esend button
 const start_timer_for_resend_button = () => {
  set_OTP_resend_time(40);
  set_show_resend_button(false);

  if (timer_for_resend_OTP.current) {
    clearInterval(timer_for_resend_OTP.current);
  }

  timer_for_resend_OTP.current = setInterval(() => {
    set_OTP_resend_time((prev) => {
      if (prev === 1) {
        clearInterval(timer_for_resend_OTP.current);
        set_show_resend_button(true); 
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};
  
// for Login a user
  const handle_login_submit = (event) => {
    event.preventDefault();
  
    set_login_email_error('');
    set_login_password_error('');
  
    if (!login_email) {
      set_login_email_error('Email is required');
      return;
    }
    if (!login_password) {
      set_login_password_error('Password is required');
      return;
    }

    fetch('https://test-node-90rz.onrender.com/login_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: login_email,
        password: login_password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Something went wrong');
          });
        }
        return response.json();
      })
      .then((data) => {
  
        
        if(data.error){
          set_login_email_error(data.error);
          set_login_password_error(data.error);
        }else{
          const { token } = data;
          window.localStorage.setItem(localstorage_key_for_jwt_user_side_key,token);
          window.location.reload();
        }
        
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

// sign_up step - 1 : Send OTP
  const signup_send_otp = (e) => {
    set_show_form_loder(true)

    let validate_email = (email) => {
      const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return email_regex.test(email);
    };
    
    e.preventDefault();
    if (!validate_email(signup_email)) {
      set_signup_email_error('Invalid email address');
      set_show_form_loder(false);
    } else {
      set_signup_email_error('');

      fetch('https://test-node-90rz.onrender.com/send_otp_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signup_email })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if(data.error === "User with this email already exists"){
            set_signup_email_error("Email already exists")
            set_is_OTP_send_to_clint(false)
            set_show_form_loder(false)
          }else{
            set_show_form_loder(false)
            set_is_OTP_send_to_clint(true)
            set_signup_email_error("");

          }
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
      
      // Submit the form
    }
    
  };
// sign_up step - 2 : OTP Verify
  const signup_otp_verify = (e) =>{
    e.preventDefault()
    if(!signup_OTP){
      set_signup_OTP_error("Not Valide OTP");
      return;
    }

    fetch('https://test-node-90rz.onrender.com/verify_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: signup_email,otp:signup_OTP })
    })
    .then(response => {
      if (!response.ok) {
        set_signup_OTP_error("Not Valide OTP");
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data.message);
      if(data.message === "OTP verified successfully"){
        set_OTP_verify(true)
      }else{
        set_signup_OTP_error("Not Valide OTP");
      }
    })
    .catch(error => {
      set_signup_OTP_error("Not Valide OTP");
      console.error('Error:', error.message);  
    });

  }

// sign_up step - 3 : Add a new user
  const last_sign_up_button = (e) => {
    e.preventDefault();
  
    let valid = true;
  
    set_signup_user_name_error('');
    set_signup_password_error('');
    set_signup_Conform_password_error('');
  
    // Username validation
    if (signup_user_name === '') {
      set_signup_user_name_error("Username is required");
      valid = false;
    } else if (signup_user_name.length < 3) {
      set_signup_user_name_error("Username must be at least 3 characters long");
      valid = false;
    }
  
    // Password validation
    if (signup_password === '') {
      set_signup_password_error("Password is required");
      valid = false;
    } else if (signup_password.length < 4) {
      set_signup_password_error("Password must be at least 4 characters long");
      valid = false;
    } else if (!/[A-Z]/.test(signup_password)) {
      set_signup_password_error("Password must contain at least one uppercase letter");
      valid = false;
    } else if (!/\d/.test(signup_password)) {
      set_signup_password_error("Password must contain at least one digit");
      valid = false;
    }
  
    // Confirm password validation
    if (signup_Conform_password === '') {
      set_signup_Conform_password_error("Confirm password is required");
      valid = false;
    } else if (signup_Conform_password !== signup_password) {
      set_signup_Conform_password_error("Passwords do not match");
      valid = false;
    }
    if (valid) {
      set_signup_email_error("")
          fetch('https://test-node-90rz.onrender.com/add_user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              { email: signup_email ,
                username:signup_user_name , 
                password:signup_password ,
                is_public:false
              })
          })
          .then(response => {
            if (!response.ok) {
              console.log(response);
              
              set_signup_email_error("Not Valide Email");
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if(data.error === "User with this email already exists"){
              set_signup_email_error("email already exists")
            }else{
              set_signup_email_error("");
            }
            if(data.message === "User registered successfully"){
              console.log(data);

              if(data.token){
                window.localStorage.setItem(localstorage_key_for_jwt_user_side_key,data.token)
                window.location.reload()
              }else{window.alert("local key will not set at clint side error")  }
            }
          })
          .catch(error => {
            set_signup_email_error("Not Valide Email");
            console.error('Error:', error.message);  
          });
    }
  };

// sign_up step - re-start function
  const handle_back_button_on_sign_up = () =>{
    let user_confirm = window.confirm("Are you sure you want back?")
    if(user_confirm){
      set_is_OTP_send_to_clint(false)
      set_OTP_verify(false)
      set_signup_email('')
      set_signup_OTP('')
      set_signup_user_name('')
      set_signup_password('')
      set_signup_Conform_password('')
      set_signup_email_error('')
      set_signup_OTP_error('')
      set_signup_user_name_error('')
      set_signup_password_error('')
      set_signup_Conform_password_error('')
    }
  }
  
  return (
    <div id='Login_register_con'>
      {/* Header */}
      <div className="login_page_header">
        <div className="main_title">
          <img src={login_main_logo} alt="" />
          <span>Chat X</span>
        </div>
        <div className="main_menu_con">
          <span>Home</span>
          <span>About</span>
          <span>Service</span>
          <span>Contact</span>
          <button onClick={()=> { set_show_login_pop_menu(true); set_is_login_page(false) }}>
            Sign up
          </button>
          <button onClick={()=> { set_show_login_pop_menu(true); set_is_login_page(true) }}>
            Sign in
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="login_page_body">
        <div className="info">
          <div className="body_title_1">
            <p>mobile chat </p>
            <span>application</span>
          </div>
          <div className="other_text">
            Chat messaging, or instant messaging, is a quick and easy way to send messages in real time over the
            internet.
          </div>
          <button onClick={()=> { set_show_login_pop_menu(true); set_is_login_page(false) }}>
            Get started
          </button>
        </div>
        <div className="login_page_main_img">
          <img src={login_main_svg} alt="login_main_svg" />
        </div>
      </div>

      {/* Login and Signup Popup */}
      {show_login_pop_menu && (
      <div className="login_menu_bg">
        {/* Login Form */}
        {is_login_page && (
        <div className="form login">
          <img src={close_button} onClick={()=> { set_show_login_pop_menu(false) }} className='close_button' alt="" />
          <div className="form-content">
            <header>Login</header>
            <form onSubmit={handle_login_submit}>
              {/* Login field 1 - Email */}
              <div className="field_text">
                <input type="email" placeholder="Email" className="input" autoFocus value={login_email} onChange={(e)=>
                set_login_email(e.target.value)}/>
                {login_email_error && <p className="error-text">{login_email_error}</p>}
              </div>

              {/* Login field 2 - password */}
              <div>
                <div className="field_text">

                  <input type={is_password_visible ? 'text' : 'password' } placeholder="Password" className="password"
                    value={login_password} onChange={(e)=>{set_login_password(e.target.value)}}/>
                  {is_password_visible ? (
                  <img src={visible_icon} className='eye-icon' alt="" onClick={()=> {
                  set_is_password_visible(!is_password_visible) }} />
                  ) : (
                  <img src={hide_icon} className='eye-icon' alt="" onClick={()=> {
                  set_is_password_visible(!is_password_visible) }} />
                  )}

                </div>
                {login_password_error && <p className="error-text">{login_password_error}</p>}
              </div>

              {/* for forgot page */}

              <div className="forgot_pass" onClick={()=>{set_is_show_forgot_page(true)}} >
                Forgot password?
              </div>
              <div className="login_button">
                <button>Login</button>
              </div>
            </form>
            <div className="form-link">
              <span>Don't have an account? </span>
              <div onClick={()=> { set_is_login_page(!is_login_page) }}>Signup</div>
            </div>
          </div>
        </div>
        )}

        {/* Signup Form */}
        {!is_login_page && (
        <div className="form signup">
          <img src={close_button} onClick={()=> { set_show_login_pop_menu(false) }} className='close_button' alt="" />

          {show_form_loder &&
          <ShowLoder />}

          <div className="form-content">
            <header>Sign up</header>
            <form>

              {OTP_verify &&
              <img src={back_icon} alt="" onClick={handle_back_button_on_sign_up} />}

              {!OTP_verify ? (
              <>
                {/* Signup field 1 - Email */}
                <div className="field_text">
                  <input type="email" placeholder="Email" className="input" autoFocus value={signup_email}
                    onChange={(e)=> set_signup_email(e.target.value)}/>
                  {signup_email_error && <p className="error-text">{signup_email_error}</p>}
                </div>
                {/* Signup field 2 - OTP */}
                <div className="field_text">
                  <input type="text" placeholder="OTP" value={signup_OTP} onChange={(e)=>
                  set_signup_OTP(e.target.value)} className="input"
                  disabled={!is_OTP_send_to_clint} />
                  {signup_OTP_error && <p className="error-text">{signup_OTP_error}</p>}
                </div>
              </>
              ) : (
              <>
                {/* Signup field 1 - Email */}
                <div className="field_text">
                  <input type="email" placeholder="Email" className="input" value={signup_email} readOnly />
                </div>
                {/* Signup field 3 - User name */}
                <div className="field_text">
                  <input type="text" placeholder="User name" className="input" value={signup_user_name} onChange={(e)=>
                  set_signup_user_name(e.target.value)} />
                  {signup_user_name_error && <p className="error-text">{signup_user_name_error}</p>}
                </div>
                {/* Signup field 4 - password */}
                <div>
                  <div className="field_text">
                    <input type={is_Sign_up_password_visible ? 'text' : 'password' } placeholder="Create password"
                      className="password" value={signup_password}
                      onChange={(e)=>{set_signup_password(e.target.value)}}/>

                    {is_Sign_up_password_visible ? (
                    <img src={visible_icon} className='eye-icon' alt="" onClick={()=> {
                    set_is_Sign_up_password_visible(!is_Sign_up_password_visible) }} />
                    ) : (
                    <img src={hide_icon} className='eye-icon' alt="" onClick={()=> {
                    set_is_Sign_up_password_visible(!is_Sign_up_password_visible) }} />
                    )}
                  </div>
                  {signup_password_error && <p className="error-text">{signup_password_error}</p>}
                </div>

                {/* Signup field 5 - confim password */}
                <div>
                  <div className="field_text">
                    <input type={is_Sign_up_Conform_password_visible ? 'text' : 'password' }
                      placeholder="Confirm password" className="password" value={signup_Conform_password}
                      onChange={(e)=>{set_signup_Conform_password(e.target.value)}}/>

                    {is_Sign_up_Conform_password_visible ? (
                    <img src={visible_icon} className='eye-icon' alt="" onClick={()=> {
                    set_is_Sign_up_Conform_password_visible(!is_Sign_up_Conform_password_visible) }} />
                    ) : (
                    <img src={hide_icon} className='eye-icon' alt="" onClick={()=> {
                    set_is_Sign_up_Conform_password_visible(!is_Sign_up_Conform_password_visible) }} />
                    )}
                  </div>
                  {signup_Conform_password_error && <p className="error-text">{signup_Conform_password_error}</p>}
                </div>
              </>
              )}

              <div className="login_button">
                { OTP_verify ? (
                <button onClick={(e)=> { last_sign_up_button(e); }}>
                  Sign Up
                </button>
                ) : (
                is_OTP_send_to_clint ? (
                <div className="verify_otp_button_con">
                  <button onClick={(e)=> { signup_otp_verify(e); }}>
                    Verify OTP
                  </button>
                  <button onClick={(e)=> { signup_send_otp(e); start_timer_for_resend_button() }} disabled={!show_resend_button}>
                    <img src={refresh} alt="refresh" />
                    Resend OTP {OTP_resend_time !== 0 ? `in ${OTP_resend_time}s`:''}
                  </button>
                </div>
                ) : (
                <button onClick={(e)=> { signup_send_otp(e);start_timer_for_resend_button() }} >
                  Send OTP
                </button>
                )
                )}

              </div>
            </form>

            <div className="form-link">
              <span>Already have an account? </span>
              <div className="link login-link" onClick={()=> { set_is_login_page(!is_login_page) }}>Login</div>
            </div>
          </div>

        </div>
        )}
      </div>
      )}

  {/* Forgot password page */}
      {is_show_forgot_page && <ForgotPassword close_by_other_file_function={()=>{set_is_show_forgot_page(false)}}/>}

    </div>
  );
}

export default LoginRegister;

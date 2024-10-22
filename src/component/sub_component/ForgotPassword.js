import React, { useState } from 'react';
import ShowLoder from './show_loder'
import back_icon from '../Data/back.png';
import hide_icon from '../Data/hide.png';
import visible_icon from '../Data/visible.png';
import close_button from '../Data/close.png';

import '../css_files/ForgotPassword.css'

const ChangePassword = ({close_by_other_file_function}) => {
  const [Forgot_form_data, set_Forgot_form_data] = useState({
    email: '',
    OTP: '',
    password: '',
    confirmPassword: '',
    email_error: '',
    OTP_error: '',
    password_error: '',
    confirmPassword_error: '',
  });

  
 

  const [OTP_verified, set_OTP_verified] = useState(false);
  const[loder_for_forget_form,set_loder_for_forget_form] = useState(false)
  const [show_send_otp, set_show_send_otp] = useState(true);

  const [is_password_visible, set_is_password_visible] = useState(false);
  const [is_Conform_password_visible, set_is_Conform_password_visible] = useState(false);

  const handle_back_button_on_forget_passwrod = () =>{
    let user_confirm = window.confirm("Changes are not save..!!\nAre you sure you want back?")
    if(user_confirm){
      set_Forgot_form_data({
        email: '',
        OTP: '',
        password: '',
        confirmPassword: '',
        email_error: '',
        OTP_error: '',
        password_error: '',
        confirmPassword_error: '',
      })
      set_OTP_verified(false)
      set_loder_for_forget_form(false)
      set_show_send_otp(true)
    }
  }


  const handle_Forgot_form_data = (event) => {
    const { name, value } = event.target;
    set_Forgot_form_data((prev) => ({
      ...prev,
      [name]: value,
      [`${name}_error`]: '', // Clear error when user types
    }));
  };

  const handleSendOTP = () => {
    set_loder_for_forget_form(true)
    const { email } = Forgot_form_data;

    if (!email) {
      set_loder_for_forget_form(false)
      set_Forgot_form_data((prev) => ({ ...prev, email_error: 'Email is required' }));
      return;
    }

    fetch('https://node-test-g5gn.vercel.app/send_otp_email_if_exists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          set_Forgot_form_data((prev) => ({ ...prev, email_error: data.error }));
          set_loder_for_forget_form(false)
        } else {
          set_show_send_otp(false);
          set_loder_for_forget_form(false)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        set_loder_for_forget_form(false)
      });
  };

  const handleVerifyOTP = () => {
    const { email, OTP } = Forgot_form_data;

    // Validate OTP
    if (!OTP) {
      set_Forgot_form_data((prev) => ({ ...prev, OTP_error: 'OTP is required' }));
      return;
    }

    fetch('https://node-test-g5gn.vercel.app/verify_otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: OTP }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          set_Forgot_form_data((prev) => ({ ...prev, OTP_error: data.error }));
        } else {
          set_OTP_verified(true);
          // OTP verified successfully
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleChangePassword = () => {
    const { password, confirmPassword } = Forgot_form_data;

    // Validate password fields
    if (!password) {
      set_Forgot_form_data((prev) => ({ ...prev, password_error: 'Password is required' }));
      return;
    }
     // Password validation
     if (password === '') {
      set_Forgot_form_data((prev) => ({ ...prev, password_error: 'Password is required'}));
      return;
    } else if (password.length < 4) {
      set_Forgot_form_data((prev) => ({ ...prev, password_error: 'Password must be at least 4 characters long'}));
      return;
    } else if (!/[A-Z]/.test(password)) {
      set_Forgot_form_data((prev) => ({ ...prev, password_error: 'Password must contain at least one uppercase letter'}));
      return;
    } else if (!/\d/.test(password)) {
      set_Forgot_form_data((prev) => ({ ...prev, password_error: 'Password must contain at least one digit'}));
      return;
    }


    if (password !== confirmPassword) {
      set_Forgot_form_data((prev) => ({ ...prev, confirmPassword_error: 'Passwords do not match' }));
      return;
    }

    fetch('https://node-test-g5gn.vercel.app/change_user_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: Forgot_form_data.email, newPassword: Forgot_form_data.password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          window.alert("password will be updated")
          close_by_other_file_function()

        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="login_menu_bg">
    <div className="form chage_password">
    {loder_for_forget_form && <ShowLoder/>}

    <img src={close_button} onClick={close_by_other_file_function}  className='close_button' alt="" />
    
      <header>Change Password</header>
      <form>
        {!show_send_otp && <img src={back_icon} alt="" onClick={handle_back_button_on_forget_passwrod}/> }
      
        <div className="field_text">
          <input
            type="email"
            placeholder="Email"
            className="input" 
            name="email"
            value={Forgot_form_data.email}
            onChange={handle_Forgot_form_data}
            readOnly={OTP_verified}
          />
          {Forgot_form_data.email_error && <p className="error-text">{Forgot_form_data.email_error}</p>}
        </div>
        
        {!OTP_verified && (
          <div className="field_text">
            <input
              type="text"
              placeholder="OTP"
              className="input"
              disabled={show_send_otp}
              value={Forgot_form_data.OTP}
              onChange={(e) => set_Forgot_form_data({ ...Forgot_form_data, OTP: e.target.value })}
            />
            {Forgot_form_data.OTP_error && <p className="error-text">{Forgot_form_data.OTP_error}</p>}
          </div>
        )}

        {OTP_verified && (
          <>
            <div>
              <div className="field_text">
                <input type={is_password_visible ? 'text' : 'password'} placeholder="New Password" className="input" name="password" value={Forgot_form_data.password} onChange={handle_Forgot_form_data}/>
                {is_password_visible ? (
                          <img src={visible_icon} className='eye-icon' alt="" onClick={() => { set_is_password_visible(!is_password_visible) }} />
                        ) : (
                          <img src={hide_icon} className='eye-icon' alt="" onClick={() => { set_is_password_visible(!is_password_visible) }} />
                        )}
                
              </div>
              {Forgot_form_data.password_error && <p className="error-text">{Forgot_form_data.password_error}</p>}
            </div>
            
            <div>
                <div className="field_text">
                  <input type={is_Conform_password_visible ? 'text' : 'password'} placeholder="Confirm Password" className="input" name="confirmPassword" value={Forgot_form_data.confirmPassword} onChange={handle_Forgot_form_data}/>
                  
                  {is_Conform_password_visible ? (
                            <img src={visible_icon} className='eye-icon' alt="" onClick={() => { set_is_Conform_password_visible(!is_Conform_password_visible) }} />
                          ) : (
                            <img src={hide_icon} className='eye-icon' alt="" onClick={() => { set_is_Conform_password_visible(!is_Conform_password_visible) }} />
                          )}
                </div>
                {Forgot_form_data.confirmPassword_error && <p className="error-text">{Forgot_form_data.confirmPassword_error}</p>}
            </div>
          </>
        )}

        <div className="login_button">
          {OTP_verified ? (
            <button type="button" onClick={handleChangePassword}>
              Save Password
            </button>
          ) : (
            show_send_otp ? (
                <button type="button" onClick={handleSendOTP}>
                  Send OTP
                </button>
              ) : (
            <button type="button" onClick={handleVerifyOTP}>
              Verify OTP
            </button>
              )
            
          )}
        
        </div>
      </form>
    </div>
    </div>
  );
};

export default ChangePassword;

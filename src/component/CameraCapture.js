import React, { useRef, useEffect, useState } from 'react';
import './css_files/CameraCapture.css'; // Import the CSS file


const CameraCapture = ({ is_dark_mode, file_clsoe_fun, sending_email, current_active_room_id, current_active_room_data, user_data_email }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState('');
  
    const back_menu_icon = require(`./Data/Home_page_data/${is_dark_mode}/back.png`);
  
    useEffect(() => {
      const initCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setError(err.message);
          console.error('Error accessing camera: ', err);
        }
      };
  
      initCamera();
  
      const currentVideoRef = videoRef.current;
  
      return () => {
        if (currentVideoRef && currentVideoRef.srcObject) {
          const stream = currentVideoRef.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }, []);
  
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
  
    const captureImage = async () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
  
      if (!video.videoWidth || !video.videoHeight) {
        let temp_error = error
        if(temp_error.includes('Camera is not available')){
          return
        }
        setError(`Camera is not available : ${temp_error}`);
        return;
      }
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
  
      // Convert the canvas to a Blob and then to Base64
      canvas.toBlob(async (blob) => {
        if (blob) {
          const chatImgBase64 = await convertToBase64(blob);
          handleSubmit(chatImgBase64);
        }
      }, 'image/png');
    };
  
    const handleSubmit = async (chatImgBase64) => {
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
            message:'',
            send_time: new Date().toISOString(),
            chat_img: chatImgBase64.split(',')[1], // Get only the base64 part without metadata
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        setError(''); // Clear any existing errors
      } catch (error) {
        console.error('Error sending chat message:', error);
        setError('Failed to send the message. Please try again.');
      }
    };
  
    return (
      <div id='CameraCapture' onClick={(e)=>{e.stopPropagation()}}
       className={`${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
        <div className="title">
          <div className="back" onClick={file_clsoe_fun}>
            <img src={back_menu_icon} alt="back_menu_icon" />
          </div>
          <p className={`${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
            Chat X Camera
          </p>
        </div>
        {error
         &&
          <p style={{ color: 'red', fontSize: "1.2rem" }}>{error}</p>
          
          }
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
        <div className={`bottom_bar ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
          <button onClick={captureImage}>Send to <strong>{sending_email}</strong></button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  };
  
  export default CameraCapture;
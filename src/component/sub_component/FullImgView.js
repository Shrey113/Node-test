import React, { useState } from 'react';
import './../css_files/FullImgView.css';

function FullImgView({ is_dark_mode,
     show_bottom_list,
     show_full_menu,
     main_img_to_show,
     all_bottom_list,
     file_close_function }) {
  const back_icon = require(`../Data/Home_page_data/${is_dark_mode}/back.png`);
  const downloads_icon = require(`../Data/Home_page_data/${is_dark_mode}/downloads.png`);
  const zoom_in_icon = require(`../Data/Home_page_data/${is_dark_mode}/zoom-in.png`);
  const zoom_out_icon = require(`../Data/Home_page_data/${is_dark_mode}/magnifying-glass.png`);
  const star_icon = require(`../Data/Home_page_data/${is_dark_mode}/star.png`);
  const happiness_icon = require(`../Data/Home_page_data/${is_dark_mode}/happiness.png`);
  const more_icon = require(`../Data/Home_page_data/${is_dark_mode}/more.png`);
  const rotate_left_icon = require(`../Data/Home_page_data/${is_dark_mode}/rotate-left.png`);
  const reset_icon = require(`../Data/Home_page_data/${is_dark_mode}/reset.png`);

  const [zoom_level, set_zoom_level] = useState(1);
  const [rotate_angle, set_rotate_angle] = useState(0);
  const [pos_x, set_pos_x] = useState(0);
  const [pos_y, set_pos_y] = useState(0);
  const [is_dragging, set_is_dragging] = useState(false);
  const [start_x, set_start_x] = useState(0);
  const [start_y, set_start_y] = useState(0);

  const handle_zoom_in = () => set_zoom_level(prev => Math.min(prev + 0.3, 3));
  const handle_zoom_out = () => set_zoom_level(prev => Math.max(prev - 0.3, 0.6));
  const handle_rotate = () => set_rotate_angle(prev => (prev + 90) % 360);

  const handle_mouse_down = (e) => {
    set_is_dragging(true);
    set_start_x(e.clientX - pos_x);
    set_start_y(e.clientY - pos_y);
  };

  const handle_mouse_move = (e) => {
    if (is_dragging) {
      set_pos_x(e.clientX - start_x);
      set_pos_y(e.clientY - start_y);
    }
  };

  const handle_mouse_up = () => set_is_dragging(false);

  
  const handle_scroll_zoom = (e) => {
    e.preventDefault(); 
    if (e.deltaY < 0) {
      handle_zoom_in(); 
    } else {
      handle_zoom_out(); 
    }
  };

  const handle_reset = () => {
    set_zoom_level(1);
    set_rotate_angle(0);
    set_pos_x(0);
    set_pos_y(0);
  };

  const has_changes = zoom_level !== 1 || rotate_angle !== 0 || pos_x !== 0 || pos_y !== 0;


  function downloadImage(url, customFileName) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = customFileName || url.split('/').pop(); // Use custom filename or fallback to the filename from the URL
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up
        })
        .catch(error => {
            console.error('There was a problem with the download:', error);
        });
}


downloadImage('https://example.com/path/to/image.jpg', 'my-custom-image-name.jpg');


  return (
    <div
      id="FullImgView"
      onClick={(e)=>{e.stopPropagation()}}
      className={`${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}
      onMouseMove={handle_mouse_move}
      onMouseUp={handle_mouse_up}
      onMouseLeave={handle_mouse_up} 
    >
      <div className="top_bar">
        <div className="back_button">
          <img src={back_icon} alt="Back" onClick={file_close_function} />
          <p>Chat X File Viewer</p>
        </div>
        <div className="right_bar">
        {has_changes && (
            <img src={reset_icon} alt="Reset" onClick={handle_reset} /> 
          )}
          {show_full_menu && 
            <img src={downloads_icon} onClick={()=>{downloadImage(main_img_to_show,"Chat X @shrey11_")}} alt="Download" />
          }
          <img src={rotate_left_icon} alt="Rotate" onClick={handle_rotate} style={{ transform: "rotateY(180deg)" }} />
          <img src={zoom_in_icon} alt="Zoom In" onClick={handle_zoom_in} />
          <img src={zoom_out_icon} alt="Zoom Out" onClick={handle_zoom_out} />
          <div className="line_bar"></div>

          {show_full_menu && 
          <>
            <img src={star_icon} alt="Favorite" />
            <img src={happiness_icon} alt="React" />
          </>          
          }

          <img src={more_icon} alt="More Options" />
        </div>
      </div>
      <div className="main_full_img" onWheel={handle_scroll_zoom}  onMouseDown={handle_mouse_down}>
        <img src={main_img_to_show} alt="Main View" 
            
          style={{ cursor: is_dragging ? 'grabbing' : 'grab', transform: `scale(${zoom_level}) rotate(${rotate_angle}deg) translate(${pos_x}px, ${pos_y}px)`,
            transition: is_dragging ? 'none' : 'transform 0.3s ease' }} draggable={false} />
      </div>
      <div className="bottom_bar">
      {show_bottom_list  && 
        <>
            <img src={happiness_icon} alt="" />
            <img src={happiness_icon} alt="" />
            <img src={happiness_icon} alt="" />
            <img src={happiness_icon} alt="" />
        </>      
      }

      </div>
    </div>
  );
}

export default FullImgView;

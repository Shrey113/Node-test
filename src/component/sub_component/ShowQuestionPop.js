import React from 'react'
import './ShowQuestionPop.css'
function ShowQuestionPop({is_dark_mode,title,message,yes_button_fun,no_button_fun}) {
  return (
    <div id='show_question_pop' onClick={(e)=>{e.stopPropagation()}}>
      <div className="pop_menu">
        <div className={`top_bar ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
          <div className="title">{title}</div>
          <div className="message">{message}</div>
        </div>
        <div className={`bottom_bar ${is_dark_mode === 'Light' ? 'light_mode' : 'dark_mode'}`}>
          <div className="yes_button" onClick={yes_button_fun}>Ok</div>
          <div className="no_button" onClick={no_button_fun}>Cancel</div>
        </div>
      </div>
    </div>
  )
}

export default ShowQuestionPop

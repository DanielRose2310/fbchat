import { Animated } from "react-animated-css";
import React, { useCallback } from 'react';
import ReactTooltip from 'react-tooltip';
import "../styles.css"
const FA = require('react-fontawesome')

export const ChatBox = (props) => {
  const scrollRef = useCallback(node=>{
    if (node){
    node.scrollIntoView({smooth:'true'})
    }
  },[])
  return  <div
  className="position-fixed w-100"
  style={{ bottom: 0, zIndex: 0 }}
>
  <div className="row col-12">
    {props.chatPartners.map((partner, i) => (
  <Animated key={i} animationIn={"bounceInUp"} isVisible={true} className=" d-flex flex-column color2 col-3 mx-1  rounded"
    style={{ zIndex: 3 }}
  >
    <div className="row px-5 justify-content-between mb-2 align-items-center color4"><span className="row pt-3" ><img
      src={"avi" + partner.image + ".png"}
      alt="avi"
      style={{ width: "24px", height: "24px" }}
    ></img><p>&nbsp;{partner.userName}</p></span>
      <FA name="times" className=" closebtn col-1
            " onClick={(e) => { props.handleCloseChat(partner._id) }} />
    </div>
    <div className="chatboxdiv" style={{ height: "280px", overflowY: "auto" }}>
      {props.chatRows.map(msg =>
        msg.senderId === partner._id || msg.recipientId === partner._id ?
          msg.senderId===props.self._id ?
              <span ref={scrollRef} key={Math.random(999999)} className="d-flex mx-1 flex-row-reverse">
                <img 
                  src={"avi" + props.self.image + ".png"}
                  alt="avi"
                  style={{ width: "24px", height: "24px" }}
                ></img>   <ReactTooltip />
                <p>
                  <b>&nbsp;:{props.self.userName}</b>&nbsp;
               </p>
                <p className="py-1"> {msg.payload}</p>
              </span>
              : <span ref={scrollRef} key={Math.random(999999)} className="row mx-1">
                <img 
                
                  src={"avi" + props.users.find(user=>msg.senderId===user._id).image + ".png"}
                  alt="avi"
                  style={{ width: "24px", height: "24px" }}
                ></img>   <ReactTooltip />
                <p>
                  <b>&nbsp;{props.users.find(user=>msg.senderId===user._id).userName}</b>:&nbsp;
    </p>
                <p className="py-1"> {msg.payload}</p>
              </span> : null)}
    </div>
    <div className=" w-100" style={{ bottom: 0 }}>
    </div>
    <span className="row p-1 justify-content-between">
      <input className="w-75" disabled={!props.onlineUsers.find(onlineuser => onlineuser.userId === partner._id)}
        value={props.msgContent[partner._id] ? props.msgContent[partner._id] : ""}
        onChange={(e) => props.handleMsgContent(partner._id, e)}
        onKeyPress={(e) => { props.handleChatKeypress(props.self._id, partner._id, props.msgContent[partner._id], e) }}
        placeholder={props.onlineUsers.find(onlineuser => onlineuser.userId === partner._id) ? "Enter your message..." : ""}></input>
      {props.onlineUsers.find(onlineuser => onlineuser.userId === partner._id) ? <button className="w-25 btn"
        onClick={() => {
          props.handleSend(props.self._id, partner._id, props.msgContent[partner._id])
        }}>Submit</button> : <div className="w-25 text-center color2"
        >User Offline!</div>}
    </span>
  </Animated>

))}
</div>
</div>

}

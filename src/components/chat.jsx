import { Animated } from "react-animated-css";
import React, { useCallback } from 'react';
import ReactTooltip from 'react-tooltip';
import {InView} from "react-intersection-observer";
import "../styles.css"
const FA = require('react-fontawesome')
export const ChatBox = (props) => {
  console.log(props)
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
    {props.chatLogs.map((log, i) => (
  <Animated key={i} animationIn={"bounceInUp"} isVisible={true} className=" d-flex flex-column color2 col-3 mx-1  rounded"
    style={{ zIndex: 3 }}
  >
    <div className="row px-5 justify-content-between mb-2 align-items-center color4"><span className="row pt-3" ><img
      src={"avi" + props.users.find(user=>user._id===log.partnerId).image + ".png"}
      alt="avi"
      style={{ width: "24px", height: "24px" }}
    ></img><p>&nbsp;{props.users.find(user=>user._id===log.partnerId).userName}</p></span>
      <FA name="times" className=" closebtn col-1
            " onClick={() => { props.handleCloseChat(log.chatId, ) }} />
    </div>
    <div className="chatboxdiv d-flex flex-column" style={{ height: "280px", overflowY: "auto" }}>
    {log.messages.length<log.msgCount?<InView as="span"  onChange={(inView)=>{if (inView){props.getBatch(log.chatId,(Math.floor(log.messages.length/10))+1)}}} className="align-self-center m-1"><FA name="arrow-circle-up" style={{fontSize:"24px"}} />
    </InView>:null}
      {log.messages.map(msg =>
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
              </span> 
              )}
             {props.typingUsers.includes(log.partnerId)?<p className="istyping">{props.users.find(user=>user._id===log.partnerId).userName} is typing</p>:null}
    </div>
    <div className=" w-100" style={{ bottom: 0 }}>
    </div>
    <span className="row p-1 justify-content-around">
      <input className="w-75" disabled={!props.onlineUsers.find(onlineuser => onlineuser.userId === log.partnerId)}
        value={props.msgContent[log.partnerId] ? props.msgContent[log.partnerId] : ""}
        onChange={(e) => props.handleMsgContent(log.partnerId, e)}
        onKeyPress={(e) => { props.handleChatKeypress(props.self._id, log.partnerId, props.msgContent[log.partnerId], e) }}
        placeholder={props.onlineUsers.find(onlineuser => onlineuser.userId === log.partnerId) ? "Enter your message..." : ""}></input>
      {props.onlineUsers.find(onlineuser => onlineuser.userId === log.partnerId) ? <button className="w-25 color3 submitbtn" 
        onClick={() => {
          props.handleSend(props.self._id, log.partnerId, props.msgContent[log.partnerId])
        }}>Submit</button> : <div className="w-25 text-center color2"
        >User Offline!</div>}
    </span>
  </Animated>

))}
</div>
</div>

}

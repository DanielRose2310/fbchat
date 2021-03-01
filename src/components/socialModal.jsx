import React, {useRef } from 'react';
import { Animated } from "react-animated-css";
import Draggable from 'react-draggable';
const FA = require('react-fontawesome')

export function Social(props) {
    const draggableRef = useRef(null);
    return <Draggable draggableRef={draggableRef}>
    <div ref={draggableRef} className="socialbox position-fixed rounded offset-10 col-2 mt-5" style={{backgroundColor:"RGBA(183, 173, 207, 0.7)", zIndex:3}}>
            <h3 className="row justify-content-center" style={{backgroundColor:"#dee7e7"}}>Contacts</h3>
            <div  className="d-flex flex-column">
            {props.contacts.length ? props.contacts.map((contact, i) =><Animated key={i} animationIn="bounceInRight" animationOut="bounceOutRight" className="row justify-content-around px-2 align-items-center"> 
            {props.onlineUsers.find(user=>user.userId===contact._id)?<FA style={{cursor: "pointer" }} 
            name="comment"onClick={() => { props.handleMakeChatBox(contact)}}/>:<FA style={{color:"#dee7e7"}}
            name="user-times"/>}
            <Animated animationIn="bounceInRight" animationOut="bounceOutRight"></Animated><p style={{ fontSize: "20px" }} className="display-3 mt-3">{contact.userName}</p><img alt="avi" className="m-0 p-1" style={{ width: "40px", height: "40px", backgroundColor:"#f4faff", borderRadius:"50%" }} src={'avi' + contact.image + '.png'}/> 
            {props.onlineUsers.find(user=>user.userId===contact._id)?<FA   className="ml-2"        size="2x"  style={{ textShadow: '2px 2px rgb(222, 231, 231,1)',color:"#6E4A25"}}
            name="user"/>:<FA style={{color:"#dee7e7"}}  size="2x"
            name="bed"/>}
           </Animated>) : <div className="mx-auto mt-5"><h5>No contacts!</h5><FA className="row justify-content-center mb-5" name="frown-o"/></div>}
            </div>
    </div>
</Draggable> }

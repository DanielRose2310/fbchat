import { Animated } from "react-animated-css";
import '../styles.css';
export function UsersCatalog(props) {
    return <div className="row ml-3 col-10">
        {(props.users.map(user =>
            user._id === props.self._id ? null :
                <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} className="d-flex color1 flex-column border border-info  rounded col-3 align-items-center  m-2" key={user._id}>
                    <h2>{user.userName}</h2>
                    <img alt={user.userName} style={{ width: "100px", height: "100px", cursor: "pointer" }} src={'avi' + user.image + '.png'} />
                    <h5>{user.contacts.length} contacts</h5>
                        {props.self.contacts.includes(user._id) ?
                            <>
                            {props.chatLogs.find(log=>log.partnerId===user._id)?<button className="btn" onClick={()=>props.handleCloseChat(user._id)}>Close chat</button>
                            : <button className="btn" onClick
                            ={()=>props.handleMakeChatBox(user._id)} >Open chat</button>}
                            <button className="btn" onClick={()=>props.handleRemoveContact(props.self._id, user._id)}>Remove from contacts</button></>
                            : <button className="btn" onClick={()=>props.handleAddContact(props.self._id, user._id)}>Add to contacts</button>
                            }
                </Animated>
        )
        )}
    </div>
}
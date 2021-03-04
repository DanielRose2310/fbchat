import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Login from './components/login';
import Footer from './components/footer';
import { ChatBox } from './components/chat';
import { Social } from './components/socialModal';
import { UserProfile } from './components/userProfile';
import { UsersCatalog } from './components/userCatalog';
import { config } from './config.js';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
export default function App() {
	const [self, setSelf] = useState([]);
	const [users, setUsers] = useState([]);
	const usersRef = useRef([])
	const [contacts, setContacts] = useState([]);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [isLogged, setIsLogged] = useState(false);
	const socket = useRef();
	const activeChatsRef = useRef([]);
	const [msgContent, setMsgContent] = useState({});
	const [chatRows, setChatRows] = useState([]);
	const [chatPartners, setChatPartners] = useState([]);
	const chatPartnersRef = useRef([]);
	

	const handleOutgoingMessage = (_senderId, _recipientId, _payload) => {
		if (_payload) {
			let chatId = [];
			chatId.push(_senderId, _recipientId);
			chatId = chatId.sort().join('');
			let msgobj = {
				senderId: _senderId,
				recipientId: _recipientId,
				payload: _payload,
				chatId: chatId,
			};
			axios
				.put(config.apiUrl + 'logs/update/', {
					senderId: _senderId,
					recipientId: _recipientId,
					payload: _payload,
					chatId: chatId,
				})
				.then((res) => {
					if (res.status === 200) {
						console.log(res);
						socket.current.emit('SEND_MESSAGE', msgobj);
					}
				});
		}
	};

	const handleAddContact = (_userId, _contactId) => {
		if (!self.contacts.includes(_contactId)) {
			let chatId = [];
			chatId.push(_userId, _contactId);
			chatId = chatId.sort().join('');
			Promise.all([
				axios.patch(config.apiUrl + 'users/addcontact/', { userId: _userId, contactId: _contactId }),
				axios.patch(config.apiUrl + 'users/addcontact/', { userId: _contactId, contactId: _userId }),
				axios.post(config.apiUrl + 'logs/new/', { chatId: chatId }),
			]).then(() => refreshData(_userId));
		}
	};
	const handleRemoveContact = (_userId, _contactId) => {
		if (self.contacts.includes(_contactId)) {
			Promise.all([
				axios.patch(config.apiUrl + 'users/removecontact/', { userId: _userId, contactId: _contactId }),
				axios.patch(config.apiUrl + 'users/removecontact/', { userId: _contactId, contactId: _userId }),
			]).then(() => refreshData(_userId));
		}
	};

const handleSelf = useCallback((_userdata) => {
	setSelf(_userdata);
	setIsLogged(true);
}, []);

	useEffect(() => {
		if (localStorage.getItem("mytoken")) {
		  axios({
			method: "get",
			url: config.apiUrl + "users/userfromtoken",
			headers: {
			  "x-auth-token": localStorage.getItem("mytoken").slice(1, -1),
			},
		  }).then((res) => {
			console.log(res);
			handleSelf(res.data[0]);
		  });
		} else {
		  setIsLogged(false);
		}
	  }, [handleSelf]);

	const handleSend = (_senderId, _recipentId, _payload) => {
		handleOutgoingMessage(_senderId, _recipentId, _payload);
		setMsgContent({ ...msgContent, [_recipentId]: '' });
	};

	const handleChatKeypress = (_senderId, _recipentId, _payload, e) => {
		if (e.charCode === 13) {
			handleOutgoingMessage(_senderId, _recipentId, _payload);
			setMsgContent({ ...msgContent, [_recipentId]: '' });
		}
	};

	const handleMsgContent = useCallback((_recipientId, e) => {
		let _content = e.target.value;
		setMsgContent((content) => ({ ...content, [_recipientId]: _content }));
	}, []);

	const handleMakeChatBox = (_partner) => {
		if (!chatPartners.find((partner) => partner?._id === _partner._id)) {
			let chatId = [];
			chatId.push(_partner._id, self._id);
			chatId = chatId.sort().join('');
			getLog(chatId, 1);
			setChatPartners((chatPartners)=>[...chatPartners, _partner]);
			chatPartnersRef.current.push(_partner);
		}
	};
	const handleIncomingMessage = useCallback(
		(_msg) => {
			if (
				!chatPartnersRef.current.find((partner) => partner?._id === _msg.senderId) &&
				_msg.senderId !== self._id
			) {
				let newChatPartner = usersRef.current.find((user) => user._id === _msg.senderId);
				console.log(newChatPartner)
				setChatPartners((chatPartners) => [...chatPartners, newChatPartner]);
				chatPartnersRef.current.push(newChatPartner);
				getLog(_msg.chatId, 1)
			}
			else {
				setChatRows((chatRows) => [...chatRows, _msg])
			};
		},
		[self._id]
	);



	const handleRegNewSocket = (_user) => {
		console.log(_user);
		socket.current.emit('WELCOME_USER', _user);
	};

	const handleCloseChat = (_partnerId) => {
		let chatId = [];
		chatId.push(_partnerId, self._id);
		chatId = chatId.sort().join('');
		setChatPartners(chatPartners.filter((partner) => partner._id !== _partnerId));
		chatPartnersRef.current = chatPartnersRef.current.filter((partner) => partner._id !== _partnerId);
		setChatRows(chatRows=>chatRows.filter(chatRow=>chatRow.chatId!==chatId))
	};

	const getUsers = useCallback(() => {
		axios.get(config.apiUrl + 'users/all')
		.then((res) => {setUsers(res.data)
		usersRef.current=res.data
		}
		)
		},[]);

	useEffect(() => {
		if (isLogged) {
			getUsers();
		}
	}, [isLogged, getUsers]);
	useEffect(() => {
		socket.current = io(config.apiUrl, {
			transports: ['websocket'],
		});
		if (self._id) {
			socket.current.emit('HELLO_USER', self._id);
		}

		socket.current.on('WHO_IS_ONLINE', (_onlineUsers) => {
			setOnlineUsers(_onlineUsers);
		});

		socket.current.on('INTRODUCE_USER', (_user) => {
			getUsers()
		});
		socket.current.on('RECEIVE_MESSAGE', (_msg) => {
			console.log(_msg)
			handleIncomingMessage(_msg);
		});

	}, [self._id, handleIncomingMessage, getUsers]);
	const doContacts = useCallback(() => {
		let contactData = usersRef.current.filter((user) => self.contacts.includes(user._id));

		setContacts(contactData);
	}, [self]);

	useEffect(() => {
		if (isLogged && self?.contacts) {
			doContacts();
		}
	}, [isLogged, self?.contacts, users, doContacts]);

	const handleLogout = () => {
		socket.current.emit('GOODBYE_USER', self._id);
		setIsLogged(false);
		localStorage.removeItem('mytoken');
		setSelf(null);
	};

	const refreshData = useCallback((_userId) => {
		Promise.all([
			axios.get(config.apiUrl + 'users/userprofile/' + _userId),
			axios.get(config.apiUrl + 'users/all'),
		]).then((res) => {
			setSelf(res[0].data);
			getUsers()
		});
	}, [getUsers]);

	const getLog = (_chatId, _index) => {
			axios.get(`${config.apiUrl}logs/batch/${_chatId}/${_index}`).then((res) => {
				console.log(res.data[0])
				setChatRows((chatRows) => [...res.data[0].messages.map(message=>{message.chatId=_chatId; return message}),...chatRows]);
			});
	};
const getBatch=(_partnerId, _index)=>{
	let chatId = [];
	chatId.push(_partnerId, self._id);
	chatId = chatId.sort().join('');
	getLog(chatId, _index)
}
	return (
		<>
			{!isLogged ? (
				<>
					<Login handleSelf={handleSelf} 
					handleRegNewSocket={handleRegNewSocket} 
					/>
				</>
			) : (
				<div className='row'>
					<UserProfile
						refreshData={refreshData}
						handleLogout={handleLogout}
						self={self}
						handleSelf={handleSelf}
					/>
					<UsersCatalog
						users={users}
						handleMakeChatBox={handleMakeChatBox}
						chatPartners={chatPartners}
						isLogged={isLogged}
						self={self}
						handleCloseChat={handleCloseChat}
						handleAddContact={handleAddContact}
						handleRemoveContact={handleRemoveContact}
					/>
					<Social 
					contacts={contacts} 
					handleMakeChatBox={handleMakeChatBox} 
					onlineUsers={onlineUsers} 
					/>
					<ChatBox
						getBatch={getBatch}
						chatPartners={chatPartners}
						handleSend={handleSend}
						msgContent={msgContent}
						users={users}
						handleChatKeypress={handleChatKeypress}
						handleMsgContent={handleMsgContent}
						handleOutgoingMessage={handleOutgoingMessage}
						handleCloseChat={handleCloseChat}
						handleMakeChatBox={handleMakeChatBox}
						self={self}
						onlineUsers={onlineUsers}
						chats={activeChatsRef}
						chatRows={chatRows}
					/>
				</div>
			)}

			<Footer style={{ bottom: '0px' }} />
		</>
	);
}

import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '../config.js'
import '../styles.css';
const FA = require('react-fontawesome')
export function UserProfile(props) {
    const [usernameChange, setUsernameChange] = useState('')
    const [aviSelection, setAviSelection] = useState('')
    const [userModalShow, setUserModalShow] = useState(false)
    const handleUserModal = () => {
        if (userModalShow) {
            setUserModalShow(false)
        }
        else { setUserModalShow(true) }
    }
    useEffect(() => {
        setUsernameChange(props.self.userName)
        setAviSelection(props.self.image)
    }, [props.self.userName, props.self.image])
    const handleAvi = (_value) => {
        setAviSelection(_value)
    }
    const handleUsernameInput = (_value) => {
        setUsernameChange(_value)
    }

    const handleSubmitChange = () => {
        axios({
            method: 'put',
            url: config.apiUrl + 'users/editone',
            headers: { "x-auth-token": localStorage.getItem('mytoken').slice(1, -1) },
            data: {
                userName: usernameChange,
                image: aviSelection
            }
        }).then(res => {
            console.log(res)
            if (res.status === 200) {
                toast.success("Change successful!");
                let updatedUser = {
                    _id: res.data._id,
                    userName: res.data.userName,
                    email: res.data.email,
                    admin: res.data.admin,
                    date_time: res.data.date_time,
                    image: res.data.image,
                    contacts: res.data.contacts
                }
                //props.refreshData(res.data._id)
                props.handleSelf(updatedUser)
            }
        })
            .catch((error) => {
                console.log(error)
                toast.error(error?.response?.data?.message);
            })
    }
    return <div>

        <div className="d-flex flex-column ml-5 rounded align-items-center">
            <h5 >{props.self.userName}</h5>
            <FA style={{ pointer: "cursor" }} className="infobtn" onClick={handleUserModal} name="edit" />
            <img alt="userimage" className=" mt-2" style={{ width: "100px", height: "100px" }} src={'./avi' + props.self.image + '.png'}></img>
        </div>
        <Modal show={userModalShow} animation={true} style={{ opacity: 1 }}>
            <FA name="times" className="closebtn col-1 offset-11" onClick={handleUserModal} />
            <Modal.Dialog className=" mx-5" >
                <Modal.Header className=" justify-content-center">
                    <Modal.Title>User Info</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-2 d-flex flex-column align-items-center">
                    <label htmlFor="avatar">Avatar</label>
                    <div>
                        <div className="mx-5 text-center avidiv " >

                            <input onChange={() => handleAvi(6)} type="radio" name="avinput" className="aviinput" checked={aviSelection === 6} value="6" id="6" /> <label htmlFor="6"><img alt="" src='../avi6.png'></img> </label>
                            <input onChange={() => handleAvi(5)} type="radio" name="avinput" className="aviinput" checked={aviSelection === 5} value="5" id="5" /> <label htmlFor="5"><img alt="" src='../avi5.png'></img> </label>
                            <input onChange={() => handleAvi(4)} type="radio" name="avinput" className="aviinput" value="4" checked={aviSelection === 4} id="4" /><label htmlFor="4"><img alt="" src="../avi4.png"></img></label>
                            <input onChange={() => handleAvi(3)} type="radio" name="avinput" className="aviinput" value="3" checked={aviSelection === 3} id="3" /><label htmlFor="3"><img alt="" src="../avi3.png"></img></label>
                            <input onChange={() => handleAvi(2)} type="radio" name="avinput" className="aviinput" value="2" checked={aviSelection === 2} id="2" /><label htmlFor="2"><img alt="" src="../avi2.png"></img></label>
                            <input onChange={() => handleAvi(1)} type="radio" name="avinput" className="aviinput" checked={aviSelection === 1} value="1" id="1" /><label htmlFor="1"><img alt="" src="../avi1.png"></img></label>

                        </div>
                    </div>

                    <label htmlFor="username" className="mt-2">Username</label>
                    <input value={usernameChange} onChange={(e) => handleUsernameInput(e.target.value)} id="username"></input>
                    <label htmlFor="email" className="mt-2">Email</label>
                    <input value={props.self.email} id="email" disabled></input>

                    <label htmlFor="date" className="mt-2">User Since</label>
                    <input value={props.self.date_time?.substring(0, props.self.date_time.indexOf("T"))} id="date" disabled></input>
                </Modal.Body>
                <Modal.Footer className="row justify-content-between">
                    <Button className="btn" onClick={() => props.handleLogout()}>LOG OUT</Button>
                    <Button className="btn" onClick={() => handleSubmitChange()}>Submit changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>

    </div>
}
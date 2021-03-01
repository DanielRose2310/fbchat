
import React, { useState } from 'react';
import axios from 'axios';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Animated } from "react-animated-css";
import { toast } from 'react-toastify';
import { config } from '../config.js'
import "../styles.css";
const emailpattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Login(props) {
    const [emailInput, setEmailInput] = useState('');
    const [passInput, setPassInput] = useState('');
    const [nameReg, setNameReg] = useState('');
    const [passReg, setPassReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [boxToggle, setBoxToggle] = useState('');
    const handleLoginKeypress = (e) => {
        if (e.charCode === 13) {
            handleLogin()
        }
    }
    const handleRegKeypress = (e) => {
        if (e.charCode === 13) {
            handleReg()
        }
    }
    const doEmail = (data) => {
        setEmailInput(data.target.value)
    }
    const doPassInput = (data) => {
        setPassInput(data.target.value)
    }
    const doNameReg = (data) => {
        setNameReg(data.target.value)
    }
    const doEmailReg = (data) => {
        setEmailReg(data.target.value)
    }
    const doPassReg = (data) => {
        setPassReg(data.target.value)
    }

    const handleReg = () => {
        if (!emailpattern.test(emailReg)) {
            toast.warning("Please enter a valid email address")
        }
        else {
            axios({
                method: 'post',
                url: config.apiUrl + 'users/new',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    userName: nameReg,
                    email: emailReg,
                    pass: passReg,
                }
            }).then(res => {
                console.log(res.status)
                if (res.data) {
                    toast.success("New user registered!");
                    console.log(res.data)
                    props.handleRegNewSocket(res.data)
                    setEmailInput(res.data.email)
                    setPassInput(passReg)
                    setTimeout(() => {
                        axios({
                            method: 'post',
                            url: config.apiUrl + 'users/login',
                            data: {
                                email: emailReg,
                                pass: passReg
                            }
                        }).then(res => {
                            console.log(res)
                            if (res.data.token) {
                                localStorage.setItem("mytoken", JSON.stringify(res.data.token))
                                props.handleSelf(res.data)
                                toast.info("You are logged in!");
                            }
                        })
                            .catch((error) => {
                                console.log(error)
                                if (!error.response) {
                                    toast.error("Connection error!")
                                }
                            }, 1500);
                    })
                }
            })
                .catch((error) => {
                    const errormsg = error.response.data.error
                    console.log(errormsg)
                    if (errormsg === "User already in the system") { toast.warning("User already exists! Please login") }
                    else { toast.error("Invalid credentials!") }

                })
        }
    }
    const handleLogin = () => {

        axios({
            method: 'post',
            url: config.apiUrl + 'users/login',
            data: {
                email: emailInput,
                pass: passInput
            }
        }).then(res => {
            console.log(res)
            if (res.data.token) {
                localStorage.setItem("mytoken", JSON.stringify(res.data.token))
                props.handleSelf(res.data)
                toast.info("You are logged in!");
            }
        })
            .catch((error) => {
                console.log(error)
                if (!error.response) {
                    toast.error("Connection error!")
                }
                else {
                    const errormsg = error?.response?.data?.message
                    console.log(errormsg);
                    if (errormsg === "INVALID PASSWORD") {
                        toast.error("Invalid password!");
                    } else {
                        toast.warning("No user found!")
                        setBoxToggle("register")
                        setEmailReg(emailInput)
                    }
                }
            })
    }
    return (!props.userLogged ? <div className="position-fixed">
        {(boxToggle === "") &&
            <div className="d-flex flex-column p-0 my-5">
                <button className="btn" style={{ fontSize: "18px", borderRadius: "0px 5px 5px 0px" }} onClick={(e) => setBoxToggle("login")}>LOGIN</button>
                <button className="btn my-3" style={{ textDecoration: "italic", zIndex: 1, fontSize: "11px", borderRadius: "0px 5px 5px 0px" }} onClick={(e) => setBoxToggle("register")}>REGISTER</button>
            </div>
        }
        {(boxToggle === "register") && <Animated animationIn="slideInLeft"
            isVisible={boxToggle === "register"}
            className="color2 p-3 mt-5 position-absolute"
            style={{ zIndex: 3 }}>
            <label>
                Please choose a username:
                    <input id="username"
                    onKeyPress={handleRegKeypress}
                    name="username"
                    type="text"
                    value={nameReg}
                    onChange={doNameReg}
                />
            </label>
            <label>
                Please enter your email:
                    <input id="email"
                    onKeyPress={handleRegKeypress}
                    name="email"
                    type="text"
                    value={emailReg}
                    onChange={doEmailReg}
                />
            </label>
            <label>
                Please choose a password:
                    <input type="password"
                    onKeyPress={handleRegKeypress}
                    id="password"
                    name="password"
                    value={passReg}
                    onChange={doPassReg}
                />
                <PasswordStrengthBar password={passReg} />

            </label>
            <button className="btn color2" onClick={() => handleReg()}>Submit</button>
            <button className="btn color1 ml-2" onClick={() => setBoxToggle("")}>Cancel</button>

        </Animated>}
        {(boxToggle === "login") && <Animated animationIn="slideInLeft"
            isVisible={boxToggle === "login"} className="color2 mt-5 col-2 p-3 position-fixed"
            style={{ zIndex: "3" }}>
            <label>
                Please enter your email:
      <input type="text" value={emailInput} onChange={doEmail} onKeyPress={handleLoginKeypress}
                />
            </label>
            <label>
                Please enter your password:
      <input type="password" value={passInput} onChange={doPassInput} onKeyPress={handleLoginKeypress} />
            </label>
            <button className="btn color1" onClick={() => handleLogin(emailInput, passInput)}>Login</button>
            <button className="btn ml-2 color1" onClick={() => setBoxToggle("")}>Cancel</button>
        </Animated>}</div> : null)
}
import React from 'react';

export default function Footer(props){

    return(
        <div className="row w-100 justify-content-end p-0  position-absolute" style={{bottom:"0",color:"#535657", overflow:"hidden"}}><p className="my-auto">© DANIEL ROSENBERG {new Date().getFullYear()}</p><a href="https://github.com/DanielRose2310" target="_blank" rel="noreferrer"><img alt="github" className="align-middle ml-2" src="/GitHub-Mark-64px.png"style={{height:"22px"}}></img></a></div>
    )
}
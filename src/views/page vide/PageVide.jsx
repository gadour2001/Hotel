import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import io from "socket.io-client"

const socket = io.connect("http://localhost:5001")

const PageVide = () => {
  const navigate = useNavigate()
  let user = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null

  useEffect(() => {
    socket.on("valide_Custom", () => {
      navigate('/home')
      user.user.payload.user.isActive = true;
      localStorage.setItem("user", JSON.stringify(user))
    })
  }, [socket])
  
  return (
    <div style={{ backgroundColor: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center' , height:'100vh' }}>
      <img src='/logo.png' alt='logo' style={{ width: '300px', height: '150px' ,marginTop:'10%' }} />
      <div className="spinner-border" style={{ width: '10rem', height: '10rem', color: 'white', margin:'7% ' }} role="status"></div>
      <div style={{ color: 'white' }}>
        <h1>Please Wait Until Validation...</h1>
      </div>
    </div>
  )
}

export default PageVide

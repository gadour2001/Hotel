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
    <>
    <div className="row d-flex justify-content-center " style={{height: 100+'vh',width: 100+'%',alignItems: 'center'}}>
      <div className="spinner-border" style={{width: 10 + 'rem',height:10+'rem'}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
        <div className='row text-center' style={{marginTop: -30+'rem'}}><h1>Please Wait Until Validation</h1></div>
    </div>
     
    </>
  )
}

export default PageVide

import React, { useEffect, useContext, useState } from 'react'
import { Context } from './context/contextProvider'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilBasket, cilList, cilMenu ,cilUser} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import  cart  from 'src/assets/images/cart.png'
import * as axiosApi from 'src/api/axiosApi'


const GET_ALL_RESERVATION_URL = 'reservation/get'
const UPDATE_RESERVATION_STATUS_URL='/reservation/update/status/'

const AppHeader = () => {
  const navigate = useNavigate()
  const {state , changeData} = useContext(Context)
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const role = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.payload.user.role : null
  const idClient = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.payload.user._id : null

  useEffect(()=>{
    changeData(localStorage.length-1)
    if (role==null) {
      navigate('login/0')
    }else{
      axiosApi.get(GET_ALL_RESERVATION_URL)
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          let date=new Date(res[i].horaire)
          if (date <= Date.now()) {
            axiosApi.put(UPDATE_RESERVATION_STATUS_URL , res[i]._id , {etat: "fini"})
            .then(() => { console.log('Custom status updated successfully.')
            }).catch((error) => console.error('Error updating service status:', error))
            
          }   
        }
      }).catch((err) => console.log(err))
    }

  },[state])
  
    return (
      <CHeader position="sticky" className="mb-4"  style={{backgroundColor:'#0D1E39' , height:'74px' }}>
          <CHeaderToggler
          style={{ marginRight:'100px',color:'white'}}
            className="ps-1"
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="mx-auto" to="/">
          {/* <h2 style={{color:'white'}}>{name}</h2> */}
          </CHeaderBrand>
          <CHeaderNav >
            {role === 'client' ?( 
            <CNavItem >
              <button style={{ marginRight:'30px',width: "3rem", height: "3rem", position: "relative",borderRadius:'50%',border:'none' ,backgroundColor:'white'}} onClick={(e) => navigate('/cart')}>
                <img src={cart} alt='image' width={35} />
                <div
              className="rounded-circle bg-danger d-flex justify-content-center align-item-center"
              style={{
                color: "white",
                width: "1.5rem",
                height: "1.5rem",
                position: "absolute",
                bottom: 0,
                right: 0,
                transform: "translate(25%, 25%)",
              }}
            >
              {state}
              </div>
              </button>
            </CNavItem>
            ) : ""}
            <AppHeaderDropdown />
          </CHeaderNav>
      </CHeader>
    )


}

export default AppHeader

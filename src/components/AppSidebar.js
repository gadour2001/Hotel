import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import { cilInstitution } from '@coreui/icons'

import { logoNegative } from 'src/assets/brand/logo-negative'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import * as navigation from '../_nav'
import { useNavigate } from 'react-router-dom'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const role=localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.role:null
  useEffect(()=>{
    if (role==null) {
      navigate('login/0')
    }
  },[])
 
  return (
    <CSidebar
      position="fixed"
      style={{backgroundColor:'#102542'}}
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img src='/logo.png' alt="Logo" className="sidebar-brand-full" style={{paddingBottom:'13px',paddingTop:'12px'}} width={120}/>
        <CIcon className="sidebar-brand-narrow" icon={cilInstitution} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          {
            role === 'superAdmin' ? (<AppSidebarNav items={navigation._nav} />) :
            role === 'responsableService' ? (<AppSidebarNav items={navigation._navServiceManager} />) :
            role === 'responsableClient' ? (<AppSidebarNav items={navigation._navCustomerManager} />) :
            role === 'admin' ? (<AppSidebarNav items={navigation._navAdmin} />) :
            role === 'client' ? (<AppSidebarNav items={navigation._navCustomer} />) : ""
          }
        </SimpleBar>
      </CSidebarNav>  
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

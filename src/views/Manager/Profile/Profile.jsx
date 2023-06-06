import React , {useState }from 'react'
import * as axiosApi from 'src/api/axiosApi'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
  } from '@coreui/react'
import Swal from 'sweetalert2'

const UPDATE_PASSWORD_URL = '/user/putPassword/'

const Profile = () => {

  const idServiceManager = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null

  const [visible, setVisible] = useState(false)
  const [oldPassword , setOldPassword] = useState('')
  const [newPassword , setNewPassword] = useState('')
  const [confirmPassword , setConfirmPassword] = useState('')

  const EditPassword = () => {
    if(newPassword === confirmPassword){
      axiosApi.put(UPDATE_PASSWORD_URL , idServiceManager , {newPassword : newPassword , oldPassword : oldPassword })
      .then(() => {
        setVisible(false)
        Swal.fire(
          'Updated!',
          'Your password has been updated.',
          'success'
        )
      }).catch((err) => {
        Swal.fire(
          'Failed!',
          "Your password has been dosen't updated.",
          'error'
        )
      })
    }else{
      console.log('no')
    }
  }


  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <h2>Profile</h2>
            </CCardHeader>
            <CCardBody>
              <CButton onClick={() => setVisible(!visible)}>Change Password</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal scrollable visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Change Password</CModalTitle>
          </CModalHeader>
          <CModalBody>
          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom05">Old Password</CFormLabel>
            <CFormInput 
              type="password" 
              id="validationCustom08" 
              placeholder='Old Password'
              onChange={(e) => setOldPassword(e.target.value)}
              required 
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom05">New Password</CFormLabel>
            <CFormInput 
              type="password" 
              id="validationCustom06" 
              placeholder='New Password'
              onChange={(e) => setNewPassword(e.target.value)}
              required 
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom05">Confirm New Password</CFormLabel>
            <CFormInput 
              type="password" 
              id="validationCustom07" 
              placeholder='Confirm Password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </CCol>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => EditPassword()}>Save changes</CButton>
          </CModalFooter>
        </CModal>
    </>
  )
}

export default Profile

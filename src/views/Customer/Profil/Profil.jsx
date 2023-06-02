import React , { useState , useEffect } from 'react'
import * as axiosApi from 'src/api/axiosApi'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CRow,
    CNav, 
    CNavItem,
    CNavLink, 
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormText,
} from '@coreui/react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const UPDATE_CUSTOMER_URL = '/client/put/'
const GET_CUSTOMER_URL = '/user/get/'
const UPDATE_PASSWORD_URL = '/user/putPassword/'

const Profil = () => {

  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const idCustomer = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null

  const [username , setUsername] = useState('')
  const [email , setEmail] = useState('')
  const [date , setDate] = useState('')
  const [passport , setPassport] = useState('')
  const [sold , setSold] = useState('')

  const [oldPassword , setOldPassword] = useState('')
  const [newPassword , setNewPassword] = useState('')
  const [confirmPassword , setConfirmPassword] = useState('')

  const handleSubmitCustomer = () => {
    axiosApi.put(UPDATE_CUSTOMER_URL , idCustomer ,{username : username , dateBirth : date , idPassport : passport})
    .then((res) => {
      Swal.fire(
        'Updated!',
        'Your information has been changed successfuly.',
        'success'
      )
    })
    .catch((err) => {
      Swal.fire(
        'Failed!',
        "Your information has been dosen't change.",
        'error'
      )
    })
  }

  const EditPassword = () => {
    if(newPassword === confirmPassword){
      axiosApi.put(UPDATE_PASSWORD_URL , idCustomer , {newPassword : newPassword , oldPassword : oldPassword })
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
      console.log('no');
    }
  }
  const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
  useEffect(() => {
    if(localStorage.getItem('user')){
      if(Client.isActive == false)
        {
          navigate('/wait')
        }else{
          axiosApi.getBYID(GET_CUSTOMER_URL , idCustomer)
          .then((res) => {
            setUsername(res.username)
            setEmail(res.email)
            const dateBirth = new Date(res.dateBirth).toLocaleDateString('en-GB', {
              day: '2-digit',
              year: 'numeric',
              month: '2-digit'
            }).split('/').reverse().join('-')
            setDate(dateBirth)
            setPassport(res.idPassport)
            setSold(res.solde)
          })
        }
    }
  },[])

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Profile</strong>
            </CCardHeader>
            <CCardBody>
              <h2>{sold} DT</h2>
              <CForm
                className="row g-4 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmitCustomer}
              >
                <CButton onClick={() => setVisible(!visible)}>Change Password</CButton>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom01">Username</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom01" 
                      defaultValue={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Username.</CFormFeedback>
                </CCol>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
                    <CFormInput 
                      type="email" 
                      id="validationCustom02" 
                      defaultValue={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      disabled />
                    <CFormFeedback invalid>Please choose an Email.</CFormFeedback>
                </CCol>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom04">Date of Birth</CFormLabel>
                    <CFormInput 
                      type="date" 
                      id="validationCustom04" 
                      defaultValue={date} 
                      onChange={(e) => setDate(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Date.</CFormFeedback>
                </CCol>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom05">Passport/Cin</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom05" 
                      defaultValue={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Passport Number or Cin.</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                    <CButton color="primary" type="submit">
                    Updated
                    </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal scrollable visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Change Password</CModalTitle>
          </CModalHeader>
          <CModalBody>
          <CCol md={4}>
            <CFormLabel htmlFor="validationCustom05">Old Password</CFormLabel>
            <CFormInput 
              type="password" 
              id="validationCustom08" 
              placeholder='Old Password'
              onChange={(e) => setOldPassword(e.target.value)}
              required 
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="validationCustom05">New Password</CFormLabel>
            <CFormInput 
              type="password" 
              id="validationCustom06" 
              placeholder='New Password'
              onChange={(e) => setNewPassword(e.target.value)}
              required 
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="validationCustom05">Confirm Password</CFormLabel>
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

export default Profil



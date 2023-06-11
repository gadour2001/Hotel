import React , { useState , useEffect } from 'react'
import * as axiosApi from 'src/api/axiosApi'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CRow,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import logouser from 'src/assets/images/user.png'
import { cilLockLocked } from '@coreui/icons'

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
    <div style={{textAlign: '-webkit-center'}}  >
      <CRow className='col-xl-6 col-xs-12'   >
        <CCol xs={12} >
          <CCard className="mb-4"  style={{textAlign: 'initial'}}>
            <CCardHeader>
              <div className='row'>
                <h3 className="col-6" >Profil</h3>
                <div className="col-6 "style={{textAlign:'end'}}>
                  <h5>Balance : {sold} DT</h5>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmitCustomer}
              >
              <img src={logouser} alt='user' style={{height:'55px' , width:'65px' , border:'solid 1px gray' , borderRadius:'50%' , padding:'10px' ,marginLeft: '45%'}}/>
              <div className='col-1'></div>
                <CCol className='col-12 '>
                    <CFormLabel htmlFor="validationCustom01">Username</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom01" 
                      defaultValue={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please enter a Username.</CFormFeedback>
                </CCol>
                <CCol className='col-6 '>
                    <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
                    <CFormInput 
                      type="email" 
                      id="validationCustom02" 
                      defaultValue={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      disabled />              
                      <CButton className='col-xl-6  col-xs-12 ' style={{position:'absolute' , right:'10px', marginTop:'-40px'}} onClick={() => setVisible(!visible)}><CIcon icon={cilLockLocked} /> Change Password</CButton>
                </CCol>
                <CCol className='col-12 '>
                    <CFormLabel htmlFor="validationCustom04">Date of Birth</CFormLabel>
                    <CFormInput 
                      type="date" 
                      id="validationCustom04" 
                      defaultValue={date} 
                      onChange={(e) => setDate(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please enter a Date of Birth.</CFormFeedback>
                </CCol>
                <CCol className='col-12 '>
                    <CFormLabel htmlFor="validationCustom05">Passport ID / ID</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom05" 
                      defaultValue={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please enter a Passport ID / ID.</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                    <CButton color="primary" type="submit" className='mt-3' style={{float:'right'}}>
                    Update
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
    </div>
  )
}

export default Profil



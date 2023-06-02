import React , { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser , cilCalendar , cilCreditCard} from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import * as axiosApi from 'src/api/axiosApi'
import io from "socket.io-client";

const socket = io.connect("http://localhost:5001");

const CLIENT_REGISTER = '/client/register'

const Register = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passport, setPassport] = useState("")
  const [birthday, setBirthday] = useState(null)

  const [codeValue, setCodeValue] = useState('')
  const [code, setCode] = useState('')


  const role = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.payload.user.role : null;

  useEffect(()=>{
      switch (role) {
        case 'client':
          navigate('/home')
          break;

        case 'superAdmin':
          navigate('/dashboardSuperAdmin')
          break;

        case 'responsableClient':
          navigate('/dashboardCustomerManager')
          break;

        case 'responsableService':
          navigate('/dashboardServiceManager')
          break;

        case 'admin':
          navigate('/dashboardAdmin')
          break;
      
        default:
          break;
      }
      
  },[])
 
  const handleRegister = (e) => {
    e.preventDefault()
    axiosApi.post(CLIENT_REGISTER,{
      username : username,
      email : email,
      password : password,
      dateBirth : birthday,
      idPassport : passport,
      idResp : id,
    })
    .then((res) => {
      setCode (res.verificationCode)
    }).catch((err) => console.log(err))
  }
  const verifemail = () => {
   
    if (code == codeValue) {
      setVisible(false)
      socket.emit("add_Custom")
      navigate('/')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Username" 
                      autoComplete="username" 
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      placeholder="Email" 
                      autoComplete="email" 
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput 
                      type='date' 
                      autoComplete="date" 
                      onChange={(e) => setBirthday(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilCreditCard} /></CInputGroupText>
                    <CFormInput 
                      placeholder="IDPassport / Cin" 
                      autoComplete="email" 
                      onChange={(e) => setPassport(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="primary" onClick={(e) => {handleRegister(e);setVisible(true)}}>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <CModal scrollable visible={visible}>
          <CModalHeader>
            <CModalTitle>Code verification</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup>
            <CFormInput 
              type="number" 
              id="validationCustom05" 
              placeholder='123456'
              onChange={(e) => setCodeValue(e.target.value)}
              required 
            />
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={()=>{verifemail()}} >Verif</CButton>
          </CModalFooter>
        </CModal>
    </div>
  )
}

export default Register

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
  CCardGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser , cilCalendar , cilCreditCard} from '@coreui/icons'
import { useNavigate, useParams ,Link } from 'react-router-dom'
import * as axiosApi from 'src/api/axiosApi'
import io from "socket.io-client";
import Swal from 'sweetalert2'

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
    setVisible(true)
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
      Swal.fire(
        'Registred!',
        'Email valid',
        'success'
      )
      navigate('/')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="10" lg="10" xl="10">
          <CCardGroup>
          <CCard className="text-white bg-primary py-5">
                <CCardBody className="text-center">
                  <div>
                  <img src='/logo.png' alt='logo' className='pb-4' width={150}/> 

                    <h2 className='m'>Login</h2>
                    <p>Welcome to our customer authentification site at our hotel. Please log in to access your account or create a new account if you are a new customer</p>
                    <Link to={`/login/${id}`}>
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Login
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            <CCard>
              <CCardBody className="p-4">
                <CForm onSubmit= {(e)=>handleRegister(e)}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      type='text'
                      placeholder="Username" 
                      autoComplete="username" 
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput 
                      type='email'
                      placeholder="Email" 
                      autoComplete="email" 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                    minLength={8}
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput 
                      type='date' 
                      autoComplete="date" 
                      onChange={(e) => setBirthday(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilCreditCard} /></CInputGroupText>
                    <CFormInput 
                      type='text'
                      placeholder="Passport ID / ID" 
                      autoComplete="email" 
                      minLength={7}
                      onChange={(e) => setPassport(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="primary" type='submit'>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <CModal scrollable visible={visible}>
          <CModalHeader>
            <CModalTitle>Verification Code</CModalTitle>
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
            <CButton color="primary" onClick={()=>{verifemail()}} >Verify</CButton>
          </CModalFooter>
        </CModal>
    </div>
  )
}

export default Register

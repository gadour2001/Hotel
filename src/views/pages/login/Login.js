import React, { useEffect, useState } from 'react'
import { Link, useNavigate , useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import { cilLockLocked, cilUser } from '@coreui/icons'
import * as axiosApi  from 'src/api/axiosApi'
import io from "socket.io-client";

const socket = io.connect("http://localhost:5001");

const LOGIN_URL = '/user/login'
const UPDATE_CUSTOM_LOG_URL = '/client/putlog/'
const RESET_PASSWORD_URL = '/user/forgotPassword'
const UPDATE_CUSTOM_IDRESPO_URL = '/client/putidRespo/'

const Login = () => {

  const [email_forget,setEmail_forget] = useState('')

  const navigate = useNavigate()
  const { id } = useParams()

  const [visible, setVisible] = useState(false)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const [loading , setLoading] = useState(false)
  const [message , setMessage] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    axiosApi.post(LOGIN_URL,{ email:email, password:password }).then((res) => {
      localStorage.setItem('user',JSON.stringify(res))
      if (res.user.payload.user.role === 'superAdmin') {navigate("/dashboardSuperAdmin")}
      else if(res.user.payload.user.role === 'responsableClient'){navigate("/dashboardCustomerManager")}
      else if(res.user.payload.user.role === 'client'){
        if(res.user.payload.user.isActive === false){
          if(id == '0'){
            Swal.fire(
              'Updated!',
              'Please scanne QR Code',
              'error'
            )
          }
          else{
            if(res.user.payload.user.idResponsableClient == id){
              axiosApi.edit(UPDATE_CUSTOM_LOG_URL,res.user.payload.user._id).then(() => {
                socket.emit("add_Custom")
                navigate('/wait')
              }).catch((err) => console.log(err))
            }else{
              axiosApi.edit(UPDATE_CUSTOM_IDRESPO_URL,res.user.payload.user._id, { idResponsable : id}).then(() => {
                socket.emit("add_Custom")
                navigate('/wait')
              }).catch((err) => console.log(err))
            }
          }
        }
        else{navigate('/home')}
      }
      else if(res.user.payload.user.role === 'responsableService'){navigate("/dashboardServiceManager")} 
      else if(res.user.payload.user.role === 'admin') {navigate("/dashboardAdmin")}
    }).catch((err) => {
        setMessage('login failed')
    })
    setLoading(false)
  }

  const ForgotPassword  = () => {
    axiosApi.post(RESET_PASSWORD_URL,{email : email_forget})
    .then((res) => {
      setVisible(false)
    }).catch((err) => console.log(err))
  }

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.payload.user : null;

  useEffect(()=>{
    if(user){
      switch (user.role) {
        case 'client':
          if(user.isActive == true){
            navigate('/home')
          }
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
          navigate(`login/${id}`)
          break;
      }
    }
  },[])
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Email" 
                        autoComplete="email" 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit' disabled={loading}>
                        {loading && (
                          <span className="spinner-border spinner-border-sm"></span>
                        )}
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0" onClick={() => setVisible(true)}>
                          Forgot password?
                        </CButton>
                      </CCol>
                      {message !== '' ? (
                        <div className="form-group">
                          <div className="alert alert-danger" role="alert">
                            {message}
                          </div>
                        </div>
                      ) : ""}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to={`/register/${id}`}>
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      <CModal scrollable visible={visible}>
          <CModalHeader>
            <CModalTitle>Reset Password</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup>
            <CFormInput 
              type="email" 
              id="validationCustom05" 
              placeholder='example@gmail.com'
              onChange={(e) => setEmail_forget(e.target.value)}
              required 
            />
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => ForgotPassword()} >Search</CButton>
          </CModalFooter>
        </CModal>
    </div>
  )
}

export default Login

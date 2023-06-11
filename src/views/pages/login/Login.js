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
import { cilLockLocked, cilUser , cilQrCode } from '@coreui/icons'
import * as axiosApi  from 'src/api/axiosApi'
import QrScanner from 'react-qr-scanner';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5001");

const LOGIN_URL = '/user/login'
const UPDATE_CUSTOM_LOG_URL = '/client/putlog/'
const RESET_PASSWORD_URL = '/user/forgotPassword'
const UPDATE_CUSTOM_IDRESPO_URL = '/client/putidRespo/'
const GET_ALL_CLIENTS_URL = '/client/'
const UPDATE_CUSTOM_STATUS_URL = '/client/put/status/'

const Login = () => {

  const [email_forget,setEmail_forget] = useState('')

  const navigate = useNavigate()
  const { id } = useParams()

  const [visible, setVisible] = useState(false)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading , setLoading] = useState(false)
  const [message , setMessage] = useState('')
  const [visibleQrCode , setVisibleQrCode] = useState(false)


  const handleScan = (result) => {
    if (result) {
      setVisibleQrCode(false)
      navigate(`/login/${result.text}`)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Your are in the table N° ${result.text}`,
        showConfirmButton: false,
        timer: 1500
      })
    }
  };
  
  const handleError = (error) => {
    console.error('QR code scan error:', error);
  };

  const handleLogin = (e) => {
    e.preventDefault()

    setLoading(true)
    axiosApi.post(LOGIN_URL,{ email:email, password:password }).then((res) => {
      if(res.error)
      {
        setMessage(res.error)
      }else{
        localStorage.setItem('user',JSON.stringify(res))
        if (res.user.payload.user.role === 'superAdmin') {navigate("/dashboardSuperAdmin")}
        else if(res.user.payload.user.role === 'responsableClient'){navigate("/dashboardCustomerManager")}
        else if(res.user.payload.user.role === 'client'){
          if(res.user.payload.user.isActive === false){
            if(id == '0'){
              localStorage.clear()
              Swal.fire(
                'Please scan QR Code',
                '',
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
                axiosApi.edit(UPDATE_CUSTOM_IDRESPO_URL,res.user.payload.user._id, { idResponsable : id}).then((res) => {
                  console.log(res);
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
      }
      
    }).catch((err) => {
      console.log(err);
    })
    setLoading(false)
  }

  const ForgotPassword  = (e) => {
    e.preventDefault()
    axiosApi.post(RESET_PASSWORD_URL,{email : email_forget})
    .then((res) => {
      Swal.fire(
        'Email sent!',
        'Password reset instructions sent to email',
        'success'
      )
      setVisible(false)
    }).catch((err) => console.log(err))
  }

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.payload.user : null;
  
  
  useEffect(()=>{
    axiosApi.get(GET_ALL_CLIENTS_URL)
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          let date=new Date(res[i].dateEntre)
          date.setDate(date.getDate()+res[i].nbrJour)
          if (date<=(Date.now()+(60*60*1000)) && res[i].isActive) {
            axiosApi.put(UPDATE_CUSTOM_STATUS_URL , res[i]._id , {isActive: false})
            .then(() => { console.log('Custom status updated successfully.')
            }).catch((error) => console.error('Error updating service status:', error))
            
          }
        }
      }).catch((err) => console.log(err))
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
          <CCol md={10}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <div style={{display:'flex' , justifyContent: 'space-between'}}>
                      <h1>Login</h1>
                      <CButton color="success" onClick={() => {setVisibleQrCode(true)}} style={{height:'40px'}}> 
                        <CIcon icon={cilQrCode} className="me-2" />Scan QR Code
                      </CButton>
                    </div>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    {message !== '' ? (
                        <div className="form-group mt-2">
                          <div className="alert alert-danger" role="alert">
                            {message}
                          </div>
                        </div>
                      ) : ""}
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
                        <CButton color="link" className="px-0" onClick={() => setVisible(true)} style={{ color: 'blue' }}>
                          Forgot password?
                        </CButton>
                      </CCol>
                    
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5">
                <CCardBody className="text-center">
                  <div>
                  <img src='/logo.png' alt='logo' className='pb-4' width={150}/>

                    <h2>Sign up</h2>
                    <p>Welcome to our customer authentification site at our hotel. Please log in to access your account or create a new account if you are a new customer</p>
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
            <CButton color="primary" type='submit' onClick={(e) => ForgotPassword(e)} >Confirm</CButton>
          </CModalFooter>
      </CModal>
      <CModal scrollable visible={visibleQrCode} onClose={() => setVisibleQrCode(false)}>
          <CModalBody >
            <QrScanner
              onScan={handleScan}
              onError={handleError}
              facingmode="environment"
              style={{width:'100%'}}
            />                 
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisibleQrCode(false)}>
              Close
            </CButton>
          </CModalFooter>
      </CModal>
    </div>
  )
}

export default Login

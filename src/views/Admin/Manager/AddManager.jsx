import React , { useEffect , useState } from 'react'
import Swal from 'sweetalert2'
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
    CNavLink
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import { cilMediaPlay } from '@coreui/icons'
import CIcon from '@coreui/icons-react'


const GET_RESPONSABLE_BY_ID = '/user/get/'

const GET_SERVICE_MANAGER_URL = '/user/get/'
const UPDATE_SERVICE_MANAGER_URL = '/responsableService/put/'
const ADD_SERVICE_MANAGER_URL = '/responsableService/register'
const GET_ALL_SERVISES_URL = '/service/admin/'

const GET_CUSTOMER_MANAGER_URL = '/user/get/'
const UPDATE_CUSTOMER_MANAGER_URL = '/responsableClient/put/'
const ADD_CUSTOMER_MANAGER_URL = '/responsableClient/register'



const AddManager = () => {

  const [validated, setValidated] = useState(false)
  const idAdmin = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
  const { id } = useParams()

  const [manager_username , setManager_username] = useState('')
  const [manager_email , setManager_email] = useState('')
  const [manager_password , setManager_password] = useState('')
  const [manager_date , setManager_date] = useState('')
  const [manager_service , setManager_service] = useState('')
  const [manager_Role , setManager_Role] = useState('')

  const [services , setServices] = useState([])

  const [activeForm, setActiveForm] = useState('service');


  const get_Service = (id) => {
    axiosApi.getBYID(GET_ALL_SERVISES_URL , id)
      .then((res) => setServices(res))
      .catch((err) => console.log(err))
  }

  const handleSubmitService = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else
    {
      if(id === '0')
      {
        event.preventDefault()
        axiosApi.post(ADD_SERVICE_MANAGER_URL, {
          username:manager_username,
          email:manager_email,
          password:manager_password,
          dateBirth:manager_date,
          idService:manager_service,
          idAdmin:idAdmin
        })
        .then((res) => {
          Swal.fire(
            'Added!',
            'Your manager has been added.',
            'success'
          )
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your manager has been dosen't updated.",
            'error'
          )
        })
      }else{
        axiosApi.put(UPDATE_SERVICE_MANAGER_URL, id , {
          username:manager_username,
          email:manager_email,
          password:manager_password,
          dateBirth:manager_date,
          idService:manager_service
        })
        .then((res) => {
          Swal.fire(
            'Updated!',
            'Your manager has been updated.',
            'success'
          )
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your manager has been dosen't updated.",
            'error'
          )
        })
      }
    }
    setValidated(true)
  }
  const get_ServiceManager = (id) => {
    axiosApi.getBYID(GET_SERVICE_MANAGER_URL , id)
    .then((res) => {
      setManager_username(res.username)
      setManager_email(res.email)
      setManager_password(res.password)
      const dateBirth = new Date(res.dateBirth).toLocaleDateString('en-GB', {
        day: '2-digit',
        year: 'numeric',
        month: '2-digit'
      }).split('/').reverse().join('-'); // format the date as yyyy-mm-dd
      setManager_date(dateBirth)
      setManager_service(res.idService)
    })
    .catch((err) => console.log(err))
  }

  const renderForm1 = () => (
    <CForm
      className="row g-4 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmitService}
      >
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom01">Username</CFormLabel>
          <CFormInput 
            type="text" 
            id="validationCustom01" 
            defaultValue={manager_username} 
            onChange={(e) => setManager_username(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Username.</CFormFeedback>
      </CCol>
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
          <CFormInput 
            type="email"
            id="validationCustom02" 
            defaultValue={manager_email}
            onChange={(e) => setManager_email(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose an Email.</CFormFeedback>
      </CCol>
      {id === '0' ? (
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom03">Password</CFormLabel>
          <CFormInput 
            type="password" 
            id="validationCustom03" 
            defaultValue={manager_password} 
            onChange={(e) => setManager_password(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Password.</CFormFeedback>
      </CCol>
      ) : ("")}
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom04">Date of Birth</CFormLabel>
          <CFormInput 
            type="date" 
            id="validationCustom04" 
            defaultValue={manager_date}
            onChange={(e) => setManager_date(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Date.</CFormFeedback>
      </CCol>
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom02">Service</CFormLabel>
          <CFormSelect 
            aria-label="Default select example" 
            value={manager_service}
            onChange={(e) => {setManager_service(e.target.value)}}
          >
              <option>choose a service</option>
              {services?.map((service) => (
                  <option key={service._id} value={service._id}>{service.name}</option>
              ))}
          </CFormSelect>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit">
          {id === '0' ? "Add Service Manager" : "Update Service Manager"}
        </CButton>
      </CCol>
    </CForm>   
                    
  )


  const handleSubmitCustomer = (event) => {

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else
    {
      if(id === '0')
      { 
        event.preventDefault()
        axiosApi.post(ADD_CUSTOMER_MANAGER_URL, {
          username:manager_username,
          email:manager_email,
          password:manager_password,
          dateBirth:manager_date,
          idAdmin:idAdmin
        })
        .then((res) => {
          Swal.fire(
            'Added!',
            'Your manager has been added.',
            'success'
          )
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your manager has been dosen't updated.",
            'error'
          )
        })
      }else{
        axiosApi.put(UPDATE_CUSTOMER_MANAGER_URL, id , {
          username:manager_username,
          email:manager_email,
          password:manager_password,
          dateBirth:manager_date
        })
        .then((res) => {
          Swal.fire(
            'Updated!',
            'Your manager has been updated.',
            'success'
          )
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your manager has been dosen't updated.",
            'error'
          )
        })
      }
    }
    setValidated(true)
  }
  const get_CustomerManager = (id) => {
    axiosApi.getBYID(GET_CUSTOMER_MANAGER_URL , id)
    .then((res) => {
      setManager_username(res.username)
      setManager_email(res.email)
      setManager_password(res.password)
      const dateBirth = new Date(res.dateBirth).toLocaleDateString('en-GB', {
        day: '2-digit',
        year: 'numeric',
        month: '2-digit'
      }).split('/').reverse().join('-'); // format the date as yyyy-mm-dd
      setManager_date(dateBirth)
    })
    .catch((err) => console.log(err))
  }

  const handleNavClick = (formName) => {
    setActiveForm(formName);
  };

  


  const renderForm2 = () => (
    <CForm
      className="row g-4 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmitCustomer}
    >
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom01">Username</CFormLabel>
          <CFormInput 
            type="text" 
            id="validationCustom01" 
            defaultValue={manager_username} 
            onChange={(e) => setManager_username(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Username.</CFormFeedback>
      </CCol>
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
          <CFormInput 
            type="email" 
            id="validationCustom02" 
            defaultValue={manager_email} 
            onChange={(e) => setManager_email(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose an Email.</CFormFeedback>
      </CCol>
      {id === '0' ? (
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom03">Password</CFormLabel>
          <CFormInput 
            type="password" 
            id="validationCustom03" 
            defaultValue={manager_password} 
            onChange={(e) => setManager_password(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Password.</CFormFeedback>
      </CCol>
      ) : ("")}
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom04">Date of Birth</CFormLabel>
          <CFormInput 
            type="date" 
            id="validationCustom04" 
            defaultValue={manager_date} 
            onChange={(e) => setManager_date(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Date.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit">
          {id === '0' ? "Add Customer Manager" : "Update Customer Manager"}
        </CButton>
    </CCol>
    </CForm>
  );
  const user = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null

  useEffect(() => {
    if(user){
    if(id !== '0'){
      axiosApi.getBYID(GET_RESPONSABLE_BY_ID,id)
      .then((res) => {
        setManager_Role(res.role)
        if(res.role === 'responsableClient'){
          get_CustomerManager(id)
          setActiveForm('customer')
        }
        else{
          get_Service(idAdmin)
          get_ServiceManager(id)
        }
      })
      .catch((err) => console.log(err))
    }
    else
    {
      get_Service(idAdmin)
    }
  }
  },[])
  
  return (
    <>
      <CCard className="mb-4">
          <CCardHeader>
            <strong>Manager</strong>
          </CCardHeader>
          <CCardBody>
            <div className="example">
              
                {id === '0' ? ( 
                  <CNav variant="tabs">
                    <CNavItem>
                      <CNavLink active={activeForm === 'service'} onClick={() => handleNavClick('service')}>
                        <CIcon icon={cilMediaPlay} className="me-2" />
                        Service Manager
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink active={activeForm === 'customer'} onClick={() => handleNavClick('customer')}>
                        <CIcon icon={cilMediaPlay} className="me-2" />
                        Customer Manager
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                ) : (
                  manager_Role === 'responsableClient' ? (
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active={activeForm === 'service'} onClick={() => handleNavClick('service')} disabled>
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Service Manager
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink active={activeForm === 'customer'} onClick={() => handleNavClick('customer')}>
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Customer Manager
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  ) : (
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active={activeForm === 'service'} onClick={() => handleNavClick('service')}>
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Service Manager
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink active={activeForm === 'customer'} onClick={() => handleNavClick('customer')} disabled>
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Customer Manager
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  ))}
              
            </div>
            {activeForm === 'service' && renderForm1()}
            {activeForm === 'customer' && renderForm2()}
          </CCardBody>
        </CCard>
    </>
  )
}

export default AddManager

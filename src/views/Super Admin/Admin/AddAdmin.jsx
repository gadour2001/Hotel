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
    CFormInput,
    CFormFeedback,
    CFormLabel,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'

const GET_ADMIN_URL = '/admin/get/'
const UPDATE_ADMIN_URL = '/admin/put/'
const ADD_ADMIN_URL = '/admin/register'


const AddAdmin = () => {

  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const { id } = useParams()

  const [admin_username , setAdmin_username] = useState('')
  const [admin_email , setAdmin_email] = useState('')
  const [admin_password , setAdmin_password] = useState('')
  const [admin_date , setAdmin_date] = useState('')
  const [superAdmin , setSuperAdmin] = useState('')
  const [hotelName , setHotelName] = useState('')

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else
    {
      const idSuperAdmin  = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
      if(id === '0')
      {
        event.preventDefault()
        axiosApi.post(ADD_ADMIN_URL, {
          username:admin_username,
          email:admin_email,
          password:admin_password,
          dateBirth:admin_date,
          idSuperAdmin :idSuperAdmin,
          hotelName : hotelName,
        })
        .then(async (res) => {
          await Swal.fire(
            'Added!',
            'Your admin has been added.',
            'success'
          )
          navigate('/admin')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your admin has been dosen't updated.",
            'error'
          )
        })
      }else{
        axiosApi.put(UPDATE_ADMIN_URL, id , {
          username:admin_username,
          email:admin_email,
          dateBirth:admin_date,
          hotelName:hotelName
        })
        .then( async (res) => {
          await Swal.fire(
            'Updated!',
            'Your admin has been updated.',
            'success'
          )
          navigate('/admin')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your admin has been dosen't updated.",
            'error'
          )
        })
      }
    }
    setValidated(true)
  }

  const get_Admin = (id) => {
    axiosApi.getBYID(GET_ADMIN_URL , id)
    .then((res) => {
      setAdmin_username(res.username)
      setAdmin_email(res.email)
      setAdmin_password(res.password)
      const dateBirth = new Date(res.dateBirth).toLocaleDateString('en-GB', {
        day: '2-digit',
        year: 'numeric',
        month: '2-digit'
      }).split('/').reverse().join('-'); // format the date as yyyy-mm-dd
      setAdmin_date(dateBirth)
      setSuperAdmin(res.idSuperAdmin)
      setHotelName(res.hotelName)
    })
    .catch((err) => console.log(err))
  }
  useEffect(() => {
    if(localStorage.getItem('user')){
    if(id !== '0')
      get_Admin(id)
    }
  },[id])
  
  return (
    <>
      <CCard className="mb-4">
          <CCardHeader>
            <strong>Administrator</strong>
          </CCardHeader>
          <CCardBody>
              <CForm
                className="row g-4 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                >
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom01">Username</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom01" 
                      defaultValue={admin_username} 
                      onChange={(e) => setAdmin_username(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Username.</CFormFeedback>
                </CCol>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom02">Email</CFormLabel>
                    <CFormInput 
                      type="email" 
                      id="validationCustom02" 
                      defaultValue={admin_email} 
                      onChange={(e) => setAdmin_email(e.target.value)}
                      required 
                    />
                    <CFormFeedback invalid>Please choose an Email.</CFormFeedback>
                </CCol>
                {id === '0' ? (
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom03">Password</CFormLabel>
                    <CFormInput 
                      type="password" 
                      id="validationCustom03"
                      onChange={(e) => setAdmin_password(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Password.</CFormFeedback>
                </CCol>
                ) : ""}
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom04">Date Birthday</CFormLabel>
                    <CFormInput 
                      type="date" 
                      id="validationCustom04" 
                      defaultValue={admin_date} 
                      onChange={(e) => setAdmin_date(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Date.</CFormFeedback>
                </CCol> 
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom05">Hotel Name</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom05" 
                      defaultValue={hotelName} 
                      onChange={(e) => setHotelName(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Hotel Name.</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                    <CButton color="primary" type="submit">
                    {id === '0' ? "Add Administrator" : "Edit Administrator"}
                    </CButton>
                </CCol>
              </CForm>
          </CCardBody>
        </CCard>
    </>
  )
}

export default AddAdmin


import React , { useEffect, useState } from 'react'
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
  } from '@coreui/react'
import * as axiosApi from 'src/api/axiosApi'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const GET_SERVICE_URL = '/service/get/'
const ADD_SERVICE_URL = '/service/post'
const UPDATE_SERVICE_URL = '/service/put/'


const AddService = () => {

  const { id } = useParams()  
  const navigate = useNavigate()
  const idAdmin = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
  const [validated, setValidated] = useState(false)

  const [service_name, setService_name] = useState('')
  const [service_description, setService_description] = useState('')
  const [service_image, setService_image] = useState('')

  const [base64Image, setBase64Image] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBase64Image(reader.result)
      };
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else
    {
      if(id === '0')
      { 
        event.preventDefault()
        axiosApi.post(ADD_SERVICE_URL, {
          name:service_name,
          description:service_description,
          image:base64Image,
          idAdmin:idAdmin
        })
        .then(async (res) => {
          await Swal.fire(
            'Added!',
            'Your service has been added.',
            'success'
          )
          navigate('/service')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your service has been dosen't updated.",
            'error'
          )
        })
      }else{
        axiosApi.put(UPDATE_SERVICE_URL, id , {
          name:service_name,
          description:service_description,
          image:base64Image
        })
        .then(async (res) => {
          await Swal.fire(
            'Updated!',
            'Your service has been updated.',
            'success'
          )
          navigate('/service')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your service has been dosen't updated.",
            'error'
          )
        })
      }
    }
    setValidated(true)
  }
  const get_Service = (id) => {
    axiosApi.getBYID(GET_SERVICE_URL , id)
    .then((res) => {
      setService_name(res.name)
      setService_description(res.description)
      setBase64Image(res.image)
    })
    .catch((err) => console.log(err))
  }
  
  useEffect(() => {
    if(localStorage.getItem('user')){
    if(id !== '0')
      get_Service(id)
    }
  },[id])


  return (
    <>
      <CCard className="mb-4">
          <CCardHeader>
            <strong>Service</strong>
          </CCardHeader>
          <CCardBody>
              <CForm
                className="row g-4 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                >
                <CCol md={4}>
                    <CFormLabel htmlFor="validationService01">Name</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationService01" 
                      defaultValue={service_name} 
                      onChange={(e) => setService_name(e.target.value)}
                      required 
                    />
                    <CFormFeedback invalid>Please choose a Name.</CFormFeedback>
                </CCol>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationService02">Description</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationService02"
                      defaultValue={service_description}
                      onChange={(e) => setService_description(e.target.value)}
                    />
                </CCol>
                <CCol md={8}>
                    <CFormLabel htmlFor="validationServiceImage">Image</CFormLabel>
                    <CInputGroup className="has-validation">
                    <CFormInput
                      type="file"
                      id="validationServiceImage"
                      defaultValue={base64Image}
                      onChange={(e) => handleImageChange(e)}
                    />
                    <CFormFeedback invalid>Please choose a Image.</CFormFeedback>
                    </CInputGroup>
                </CCol> 
                <CCol xs={12}>
                <CButton color="primary" type="submit">
                  {id === '0' ? "Add Service" : "Update Service "}
                </CButton>
                </CCol>
              </CForm>
          </CCardBody>
        </CCard>
    </>
  )
}

export default AddService

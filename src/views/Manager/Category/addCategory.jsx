import React , { useState , useEffect } from 'react'
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
    CFormSelect,
    CFormTextarea,
    CInputGroup,
  } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'

const ADD_CATEGORY_URL = '/category/post'
const GET_CATEGORY_URL = '/category/get/'
const UPDATE_CATEGORY_URL = '/category/put/'
const GET_SERVISE_URL = '/service/get/'

const AddCategory = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const idService = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idService:null

  const [validated, setValidated] = useState(false)
  
  const [category_name, setCategory_name] = useState('')
  const [category_description, setCategory_description] = useState('')
  const [category_type, setCategory_type] = useState('')

  const [service , setService] = useState({})

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

  const get_Service = (id) => {
    axiosApi.getBYID(GET_SERVISE_URL,id)
      .then((res) => setService(res))
      .catch((err) => console.log(err))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else
    {
      if(id === '0')
      { 
        event.preventDefault();
        axiosApi.post(ADD_CATEGORY_URL, {
          name:category_name,
          description:category_description,
          image:base64Image,
          idService:idService, 
          type:category_type
        })
        .then(async (res) => {
          await Swal.fire(
            'Added!',
            'Your Category has been added.',
            'success'
          )
          navigate('/category')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your Category has been dosen't updated.",
            'error'
          )
        })
      }else{

        axiosApi.put(UPDATE_CATEGORY_URL, id , {
          name:category_name,
          description:category_description,
          image:base64Image,
          type:category_type
        })
        .then(async (res) => {
          await Swal.fire(
            'Updated!',
            'Your Category has been updated.',
            'success'
          )
          navigate('/category')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your Category has been dosen't updated.",
            'error'
          )
        })
      }
    }
    setValidated(true)
  }
  const get_Category = (id) => {
    axiosApi.getBYID(GET_CATEGORY_URL , id)
    .then((res) => {
      setCategory_name(res.name)
      setCategory_description(res.description)
      setBase64Image(res.image)
      setCategory_type(res.type)
    })
    .catch((err) => console.log(err))
  }
  useEffect(() => {
    if(localStorage.getItem('user')){
    get_Service(idService)
    if(id !== '0'){
      get_Category(id)
    }
  }
  },[id])
  return (
    <>
      <CCard className="mb-4">
          <CCardHeader>
            <strong>Category</strong>
          </CCardHeader>
          <CCardBody>
              <CForm
                className="row g-4 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                >
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom01">Name</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom01" 
                      defaultValue={category_name} 
                      onChange={(e) => setCategory_name(e.target.value)}
                      required />
                    <CFormFeedback invalid>Please choose a Name.</CFormFeedback>
                </CCol>
                <CCol md={6}>
                    <CFormLabel htmlFor="validationCustom02">Description</CFormLabel>
                    <CFormTextarea 
                      type="text" 
                      id="validationCustom02" 
                      onChange={(e) => setCategory_description(e.target.value)}
                      defaultValue={category_description}
                    />
                </CCol>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustom03">Service</CFormLabel>
                    <CFormInput 
                      type="text" 
                      id="validationCustom02"
                      placeholder={service.name}
                      disabled
                    />
                </CCol>
                <CCol md={4}>
                    <CFormLabel htmlFor="validationCustomUsername">Image</CFormLabel>
                    <CInputGroup className="has-validation">
                    <CFormInput
                        type="file"
                        id="validationCustomUsername"
                        defaultValue={base64Image}
                        aria-describedby="inputGroupPrepend"
                        onChange={(e) => {handleImageChange(e)}}
                    />
                    <CFormFeedback invalid>Please choose a Image.</CFormFeedback>
                    </CInputGroup>
                </CCol> 
                <CCol md={4}>
                  <CFormLabel htmlFor="validationCustom06">Type</CFormLabel>
                  <CFormSelect 
                    aria-label="Default select example" 
                    defaultValue={category_type}
                    onChange={(e) => setCategory_type(e.target.value)}
                    required
                  >
                      <option>choose a type of category</option>
                      <option value={"service"}>Service category</option>
                      <option value={"material"}>Consumable category</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CButton color="primary" type="submit">
                    {id === '0' ? "Add Category" : "Edit Category"}
                    </CButton>
                </CCol>
              </CForm>
          </CCardBody>
        </CCard>
    </>
  )
}

export default AddCategory

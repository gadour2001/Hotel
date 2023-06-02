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
import { useNavigate, useParams } from 'react-router-dom'
import { cilMediaPlay } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const UPDATE_MATERIAL_PRODUCT_URL = '/materialproduct/put/'
const ADD_MATERIAL_PRODUCT_URL = '/materialproduct/post'

const GET_CATEGORYS_BY_SERVICE_URL = '/category/getCtegorys/'
const GET_CATEGORY_URL = '/category/get/'
const GET_PRODUCT_URL = '/product/get/'

const ADD_SERVICE_PRODUCT_URL = '/'
const UPDATE_SERVICE_PRODUCT_URL = '/'


const AddProduct = () => {

  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()
  const { idProduct } = useParams()
  const { idCategory } = useParams()

  const [product_name , setProduct_name] = useState('')
  const [product_prix , setProduct_prix] = useState('')
  const [product_description , setProduct_description] = useState('')
  const [product_idCategory , setProduct_idCategory] = useState(idCategory)
  const [product_quantity , setProduct_quantity] = useState('')
  const [product__t , setProduct__t] = useState('')
  const [product_duration , setProduct_duration] = useState('')
  const [product_nbrPlaces , setProduct_nbrPlaces] = useState('')


  const [categorys , setCategorys] = useState([])
  const [category_name , setCategory_name] = useState('')


  const idService = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idService:null
  const [activeForm, setActiveForm] = useState('material')

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

  const get_Categorys = (id) => {
    axiosApi.getBYID(GET_CATEGORYS_BY_SERVICE_URL,id)   
    .then((res) => setCategorys(res))
    .catch((err) => console.log(err))
  }
  const get_Category_Name = (id) => {
    axiosApi.getBYID(GET_CATEGORY_URL , id)
    .then((res) => {
      setCategory_name(res.name)
    })
    .catch((err) => console.log(err))
  }
  const handleSubmitMaterialProduct = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else
    {
      if(idProduct === '0')
      {
        event.preventDefault()
        axiosApi.post(ADD_MATERIAL_PRODUCT_URL, {
          name:product_name,
          description:product_description,
          prix:product_prix,
          image:base64Image,
          idCategory:product_idCategory,
          quantity:product_quantity
        })
        .then(async (res) => {
          await Swal.fire(
            'Added!',
            'Your product has been added.',
            'success'
          )
          navigate('/product')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your product has been dosen't added.",
            'error'
          )
        })
      }else{
        axiosApi.put(UPDATE_MATERIAL_PRODUCT_URL, idProduct , {
          name:product_name,
          description:product_description,
          prix:product_prix,
          image:base64Image,
        })
        .then(async(res) => {
          await Swal.fire(
            'Updated!',
            'Your product has been updated.',
            'success'
          )
          navigate('/product')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your product has been dosen't updated.",
            'error'
          )
        })
      }
    }
    setValidated(true)
  }
  const get_MaterialProduct = (id) => {
    axiosApi.getBYID(GET_PRODUCT_URL , id)
    .then((res) => {
      setProduct_name(res.name)
      setProduct_description(res.description)
      setProduct_prix(res.prix)
      setBase64Image(res.image)
      setProduct_idCategory(res.idCategorie)
      setProduct_quantity(res.quantity)
    })
    .catch((err) => console.log(err))
  }

  const renderForm1 = () => (
    <CForm
      className="row g-4 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmitMaterialProduct}
      >
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom01">Name</CFormLabel>
          <CFormInput 
            type="text" 
            id="validationCustom01" 
            defaultValue={product_name} 
            onChange={(e) => setProduct_name(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Name.</CFormFeedback>
      </CCol>
      <CCol md={6}>
          <CFormLabel htmlFor="validationCustom02">Description</CFormLabel>
          <CFormTextarea 
            type="email"
            id="validationCustom02" 
            defaultValue={product_description}
            onChange={(e) => setProduct_description(e.target.value)}
          />
      </CCol>
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom03">Price</CFormLabel>
          <CFormInput 
            type="number" 
            id="validationCustom03" 
            defaultValue={product_prix} 
            onChange={(e) => setProduct_prix(e.target.value)}
            required />
          <CFormFeedback invalid>Please choose a Price.</CFormFeedback>
      </CCol>
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom04">Image</CFormLabel>
          <CFormInput 
            type="file" 
            id="validationCustom04" 
            defaultValue={base64Image}
            onChange={(e) => handleImageChange(e)}
          />
          <CFormFeedback invalid>Please choose a Image.</CFormFeedback>
      </CCol>
      <CCol md={4}>
          <CFormLabel htmlFor="validationCustom05">Quantity</CFormLabel>
          { idProduct === '0' ? (
          <CFormInput 
            type="number" 
            id="validationCustom05" 
            defaultValue={product_quantity} 
            onChange={(e) => setProduct_quantity(e.target.value)}
            required 
          />
          ):(
            <CFormInput 
            type="number" 
            id="validationCustom05" 
            defaultValue={product_quantity}
            disabled
          />
          )}
          <CFormFeedback invalid>Please choose a Quantity.</CFormFeedback>
      </CCol>
      <CCol md={4}>
      <CFormLabel htmlFor="validationCustom06">Category</CFormLabel>
      {idCategory === '0' ? (
          <CFormSelect 
            aria-label="Default select example" 
            defaultValue={product_idCategory}
            onChange={(e) => setProduct_idCategory(e.target.value)}
          >
              <option>choose a category</option>
              {categorys?.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
              ))}
          </CFormSelect>
      ) :(
          <CFormSelect 
            aria-label="Default select example" 
            disabled
          >
              <option>{category_name}</option>
          </CFormSelect>
      )}
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit">
          {idProduct === '0' ? "Add Physical Product" : "Update Physical Product"}
        </CButton>
      </CCol>
    </CForm>   
                    
  )



  const handleSubmitServiceProduct = (event) => {

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else
    {
      if(idProduct === '0')
      { 
        event.preventDefault()
        axiosApi.post(ADD_SERVICE_PRODUCT_URL, {
          name:product_name,
          description:product_description,
          prix:product_prix,
          image:base64Image,
          idCategory:product_idCategory,
          duree:product_duration,
          nbPlace:product_nbrPlaces
        })
        .then(async(res) => {
          await Swal.fire(
            'Added!',
            'Your product has been added.',
            'success'
          )
          navigate('/product')
        })
        .catch((err) => {
           Swal.fire(
            'Failed!',
            "Your product has been dosen't added.",
            'error'
          )
        })
      }else{
        axiosApi.put(UPDATE_SERVICE_PRODUCT_URL, idProduct , {
          name:product_name,
          description:product_description,
          prix:product_prix,
          image:base64Image,
          duree:product_duration,
          nbPlace:product_nbrPlaces
        })
        .then(async(res) => {
          await Swal.fire(
            'Updated!',
            'Your product has been updated.',
            'success'
          )
          navigate('/product')
        })
        .catch((err) => {
          Swal.fire(
            'Failed!',
            "Your product has been dosen't updated.",
            'error'
          )
        })
      }
    }
    setValidated(true)
  }
  const get_ServiceProduct = (id) => {
    axiosApi.getBYID(GET_PRODUCT_URL , id)
    .then((res) => {
      setProduct_name(res.name)
      setProduct_description(res.description)
      setProduct_prix(res.prix)
      setBase64Image(res.image)
      setProduct_idCategory(res.idCategorie)
      setProduct_duration(res.duree)
      setProduct_nbrPlaces(res.nbPlace)
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
    onSubmit={handleSubmitServiceProduct}
    >
    <CCol md={4}>
        <CFormLabel htmlFor="validationCustom01">Name</CFormLabel>
        <CFormInput 
          type="text" 
          id="validationCustom01" 
          defaultValue={product_name} 
          onChange={(e) => setProduct_name(e.target.value)}
          required />
        <CFormFeedback invalid>Please choose a Name.</CFormFeedback>
    </CCol>
    <CCol md={6}>
        <CFormLabel htmlFor="validationCustom02">Description</CFormLabel>
        <CFormTextarea 
          type="email"
          id="validationCustom02" 
          defaultValue={product_description}
          onChange={(e) => setProduct_description(e.target.value)}
        />
    </CCol>
    <CCol md={4}>
        <CFormLabel htmlFor="validationCustom03">Price</CFormLabel>
        <CFormInput 
          type="number" 
          id="validationCustom03" 
          defaultValue={product_prix} 
          onChange={(e) => setProduct_prix(e.target.value)}
          required />
        <CFormFeedback invalid>Please choose a Price.</CFormFeedback>
    </CCol>
    <CCol md={4}>
        <CFormLabel htmlFor="validationCustom04">Image</CFormLabel>
        <CFormInput 
          type="file" 
          id="validationCustom04" 
          defaultValue={base64Image}
          onChange={(e) => handleImageChange(e)}
        />
        <CFormFeedback invalid>Please choose a Image.</CFormFeedback>
    </CCol>
    <CCol md={4}>
        <CFormLabel htmlFor="validationCustom03">Duration</CFormLabel>
        <CFormInput 
          type="number" 
          id="validationCustom03" 
          defaultValue={product_duration} 
          onChange={(e) => setProduct_duration(e.target.value)}
          required 
        />
        <CFormFeedback invalid>Please choose a Duration.</CFormFeedback>
    </CCol>
    <CCol md={4}>
        <CFormLabel htmlFor="validationCustom03">Nbr Places</CFormLabel>
        <CFormInput 
          type="number" 
          id="validationCustom03" 
          defaultValue={product_nbrPlaces} 
          onChange={(e) => setProduct_nbrPlaces(e.target.value)}
          required 
        />
        <CFormFeedback invalid>Please choose a Nbr Places.</CFormFeedback>
    </CCol>
    <CCol md={4}>
      <CFormLabel htmlFor="validationCustom06">Category</CFormLabel>
      {idCategory === '0' ? (
          <CFormSelect 
            aria-label="Default select example" 
            defaultValue={product_idCategory}
            onChange={(e) => setProduct_idCategory(e.target.value)}
          >
              <option>choose a category</option>
              {categorys?.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
              ))}
          </CFormSelect>
      ) :(
          <CFormSelect 
            aria-label="Default select example" 
            disabled
          >
              <option>{category_name}</option>
          </CFormSelect>
      )}
      </CCol>
    <CCol xs={12}>
      <CButton color="primary" type="submit">
        {idProduct === '0' ? "Add Service Product" : "Update Service Product"}
      </CButton>
    </CCol>
    </CForm>
  );
  useEffect(() => {
    if(localStorage.getItem('user')){
    if(idCategory !== '0')
    {
      get_Category_Name(idCategory)
      if(idProduct !== '0'){
        axiosApi.getBYID(GET_PRODUCT_URL , idProduct)
        .then((res) => {
          setProduct__t(res.__t)
          if(res.__t === 'materialProduct')
            get_MaterialProduct(idProduct)
          else
            get_ServiceProduct(idProduct)
        })
      }
    }
    else
      get_Categorys(idService)
  }
  },[])
  
  return (
    <>
      <CCard className="mb-4">
          <CCardHeader>
            <strong>Product</strong>
          </CCardHeader>
          <CCardBody>
            <div className="example">
            {idProduct === '0' ? ( 
                  <CNav variant="tabs">
                    <CNavItem>
                      <CNavLink active={activeForm === 'material'} onClick={() => handleNavClick('material')} >
                        <CIcon icon={cilMediaPlay} className="me-2" />
                        Physical Product
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink active={activeForm === 'service'} onClick={() => handleNavClick('service')}>
                        <CIcon icon={cilMediaPlay} className="me-2" />
                        Service Product
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                ) : (
                  product__t === 'materialProduct' ? (
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active={activeForm === 'material'} onClick={() => handleNavClick('material')} >
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Physical Product
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink active={activeForm === 'service'} onClick={() => handleNavClick('service')} disabled>
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Service Product
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  ) : (
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active={activeForm === 'material'} onClick={() => handleNavClick('material')} disabled>
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Physical Product
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink active={activeForm === 'service'} onClick={() => handleNavClick('service')}>
                          <CIcon icon={cilMediaPlay} className="me-2" />
                          Service Product
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  ))}
            </div>
            {activeForm === 'material' && renderForm1()}
            {activeForm === 'service' && renderForm2()}
          </CCardBody>
        </CCard>
    </>
  )
}

export default AddProduct


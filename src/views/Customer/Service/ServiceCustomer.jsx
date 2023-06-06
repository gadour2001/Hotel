import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardGroup,
  CCardHeader,
  CCardImage,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CCol,
  CRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

import ReactImg from 'src/assets/images/react.jpg'
import CardService from 'src/components/Card/CardService'
import * as axiosApi from 'src/api/axiosApi'

const GET_ALL_SERVICE_ACTIVE = '/service/adminActive/'
const GET_RESPONSABLE_URL = '/user/get/'

const ServiceCustomer = () => {

  const idResponsable = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idResponsableClient:null
  const navigate = useNavigate()
  const [services , setServices] = useState([])

  const getServices = (id) => {
    axiosApi.getBYID(GET_RESPONSABLE_URL , id)
    .then((res) => {
      axiosApi.getBYID(GET_ALL_SERVICE_ACTIVE , res.idAdmin)
      .then((res) => setServices(res))
      .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
  }
  const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
  useEffect(() => {
    if(localStorage.getItem('user')){
      // if(Client.isActive == false)
      //   {
      //     navigate('/wait')
      //   }else{
          getServices(idResponsable)
        // }
    }
  },[])

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-12">
            <CCardHeader>
             <h2 className='text-center'> <strong>Our Services</strong></h2>
            </CCardHeader>
            <CCardBody>
              <CRow xs={{ cols: 1, gutter: 4 }} xl={{ cols: 3 }} md={{ cols: 1 }}>
                {services.length > 0 ? services.map((service) => (
                  <CCol xs  key={service._id}><Link to={`/serviceCustomer/productCustomer/${service._id}`}>
                    <CardService name={service.name} description={service.description} image={service.image}/>
                  </Link></CCol>
                )) : <CCol>Data Not found</CCol>}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ServiceCustomer

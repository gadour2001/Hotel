import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
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
      if(Client.isActive == false){
        navigate('/wait')
      }else{
        getServices(idResponsable)
      }
    }
  },[])

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-12">
            <CCardHeader className='text-center'>
             <h2 style={{margin : '40px 0px' , fontWeight:'bold'}} > Our Services</h2>
             <p style={{fontSize:"20px" , fontFamily:''}}>In our Hotel , we pride ourselves on providing a range of exceptional services to enhance your stay and cater to your every need. Discover the unparalleled services we offer</p>
            </CCardHeader>
            <CCardBody>
              <CRow xs={{ cols: 1, gutter: 4 }} xl={{ cols: 3 }} md={{ cols: 1 }}>
                {services.length > 0 ? services.map((service) => (
                  <CCol xs  key={service._id}><Link to={`/serviceCustomer/productCustomer/${service._id}`}>
                    <CardService name={service.name} image={service.image}/>
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

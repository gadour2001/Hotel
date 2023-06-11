import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import * as axiosApi from 'src/api/axiosApi'

import "src/assets/css/homeCustom.css"
import SwiperCore, { Autoplay } from 'swiper'

// import required modules
import { Navigation, Pagination } from "swiper"
import { useNavigate } from "react-router-dom"

const GET_SERVICE_URL = '/service/adminActive/'
const GET_HOTELNAME_URL = '/admin/getHotelName/'

const Home = () => {
  const navigate = useNavigate()
  SwiperCore.use([Autoplay])
  const [services , setServices] = useState([])
  const [name , setName ] = useState('')



  const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
    useEffect(() => {
      if(localStorage.getItem('user')){
        if(Client.isActive === false)
        {
          navigate('/login/0')
        }else{
          axiosApi.getBYID(GET_SERVICE_URL,'646fa87a03f4be6cf5fd824c')
          .then((res) => {
            setServices(res)
            axiosApi.getBYID(GET_HOTELNAME_URL , Client._id).then((res) => {
              setName(res)
            }).catch((err) => console.log(err))
          }).catch((err) => console.log(err))
        }
      }
    },[])
  return (
    <div className="html">
      <div className="description">
        <p className="titre">Welcome to <span className="name">{name}</span></p><p className="content">Your premier destination for luxury accommodation and exceptional service. At {name}, we offer a wide range of services designed to enhance your stay and provide a memorable experience.</p>
      </div>
      <div className="body">
        <div className="App">
            <Swiper style={ {
              borderRadius:'20px',
              height: "70vh",
              width:"100%",
              marginBottom:"50px",
              marginTop:"20px"
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {services.map((service) => (
             
              <SwiperSlide style={{cursor:'pointer'}} key={service._id} onClick={() => navigate(`/serviceCustomer/productCustomer/${service._id}`)}><h1 style={{position:"absolute",bottom:"45%",width:'100%',background:"#ffffff80"}}> <a className="href" > {service.name}  </a></h1><img src={service.image} alt={service.name} /></SwiperSlide>
             
            ))}
  
          </Swiper>
        </div>
      </div>
    </div>
  );
}
export default Home
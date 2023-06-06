import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import * as axiosApi from 'src/api/axiosApi'

import "src/assets/css/homeCustom.css";
import SwiperCore, { Autoplay } from 'swiper';

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import { Link, useNavigate } from "react-router-dom";

const GET_SERVICE_URL = '/service/adminActive/'

const Home = () => {

  const navigate = useNavigate()
  SwiperCore.use([Autoplay]);
  const [services , setServices] = useState([])


  const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
  console.log(Client);
    useEffect(() => {
      if(localStorage.getItem('user')){
        if(Client.isActive === false)
        {
          navigate('/login/0')
        }else{
          axiosApi.getBYID(GET_SERVICE_URL,'646fa87a03f4be6cf5fd824c').then((res) => {console.log(res); setServices(res)}).catch((err) => console.log(err))
        }
      }
    },[])
  return (
    <div className="html">
      {/* <i><span className="span">Our website</span> offers a seamless and immersive experience, bringing the exceptional hospitality of our hotel directly to you. Explore our range of exquisite accommodations, indulge in world-class dining experiences, and discover a host of personalized services tailored to your needs</i> */}
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
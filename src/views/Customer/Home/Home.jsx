import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "src/assets/css/homeCustom.css";

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate()

  const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
    useEffect(() => {
      if(localStorage.getItem('user')){
        if(Client.isActive == false)
        {
          navigate('/wait')
        }else{
        } 
      }
    },[])
  return (
    <div className="html">
      <div className="body">
        <div className="App">
          <Swiper
            cssMode={true}
            navigation={true}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="mySwiper"
          >
            <SwiperSlide>Slide 1</SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
            <SwiperSlide>Slide 5</SwiperSlide>
            <SwiperSlide>Slide 6</SwiperSlide>
            <SwiperSlide>Slide 7</SwiperSlide>
            <SwiperSlide>Slide 8</SwiperSlide>
            <SwiperSlide>Slide 9</SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
export default Home
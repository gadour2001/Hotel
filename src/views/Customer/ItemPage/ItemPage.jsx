import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as axiosApi  from 'src/api/axiosApi'
import {
    CCol,
    CFormLabel,
    CFormSelect,
} from '@coreui/react'
import io from "socket.io-client"; 
import Swal from 'sweetalert2';

const socket = io.connect("http://localhost:5001");

const GET_PRODUCT_URL = '/product/get/'
const GET_SEANCE_URL = '/seance/get/'
const POST_RESERVATION_URL = '/reservation/post'
const GET_CUSTOMER_URL = '/user/get/'

const ItemPage = () => {

    const {idProduct , idService} = useParams()
    const navigate = useNavigate()
    const idClient = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user._id:null

    const [product , setProduct] = useState({})
    const [nbrPlace , setNbrplace] = useState(1)
    const [seances , setSeances] = useState([])
    const [value , setValue] = useState('')
    const [time , setTime] = useState('')
    const [date , setDate] = useState(new Date().toISOString().split('T')[0])

    const get_Product = (id) => {
        axiosApi.getBYID(GET_PRODUCT_URL, id )
        .then((res) =>{setProduct(res)})
        .catch((err) => console.log(err))
    }

    const get_Seance = (id) => {
        axiosApi.getBYID(GET_SEANCE_URL , id + '/' + date + '/' + nbrPlace)
        .then((res) => {setSeances(res)})
        .catch((err) => console.log(err))
    }

    useEffect(() => {
      if (localStorage.getItem('user')) {
        get_Seance(idProduct)
        get_Seance(idProduct)
        get_Product(idProduct)
      }
    }, [])

    const NbrPlace = (value) => {
        if(!(nbrPlace == 1 && value == -1)){
          if(!(product.nbPlace === nbrPlace && value == 1))
            setNbrplace(nbrPlace + value)
            get_Seance(idProduct)
        }
    }

    const handleSubmit = () => {
      const dateTimeString = `${date}T${time}:00`;
      const dateTime = new Date(dateTimeString);
      
      if (isNaN(dateTime)) {
        console.error("Invalid date and time format.");
        return;
      }
    
      dateTime.setHours(dateTime.getHours() + 2);
      axiosApi.getBYID(GET_CUSTOMER_URL , idClient)
      .then((res) => {
        if(res.solde >= product.prix){
          axiosApi
          .post(POST_RESERVATION_URL, {
            prixTotal: (product.prix * nbrPlace),
            idClient,
            idService,
            horaire: dateTime.toISOString(),
            nbrPlace,
            idProduct: idProduct,
          })
          .then(async(res) => {
            await Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your Reservation has been Confirmed',
              showConfirmButton: false,
              timer: 1500
            })
            socket.emit("add_Reservation");
            navigate(`/serviceCustomer/productCustomer/${idService}`);
          }).catch((err) => console.log(err));
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Insufficient balance',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }).catch((err) => console.log(err));
    }

  return (
    <div className='card m-3 p-4'>      
    <div className='row p-2'>

      <img src={product.image}  className='col-xl-6 col-sm-12' alt={product.name} />
      <div className='col-xl-6 col-sm-12'>
      <h1>{product.name}</h1>
      <h6>{product.description}</h6>
      <br></br><h5>Price for the {product.name} session for 1 hours is {product.prix} DT</h5><br></br>
      <h5>Arrival</h5>
      <input
        type="date"
        className='form-control p-2'
        value={date}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => {setDate(e.target.value);get_Seance(idProduct)}}
        required
      />
      <div className="btn-group py-2 w-100" role="group" aria-label="First group">
        <button type="button" className="btn btn-dark" onClick={() => NbrPlace(1)}>+</button>
        <input
          style={{ width: "60px" , textAlign:"center"}}
          type="text"
          value={nbrPlace}
          readOnly 
        />
        <button type="button" className="btn btn-danger" onClick={() => NbrPlace(-1)}>-</button>
      </div>
      <CCol className='col-xl-6 col-sm-12 w-100'>
          <h5>Available arrival times</h5>
          <CFormSelect
            aria-label="Default select example"
            onChange={(e) => {setTime(e.target.value);setValue(e.target.value)}}
            >
            <option>Select arrival time</option>
            {seances?.map((seance) => (
                <option key={seance._id} style={{textAlign:'center' , fontSize:'20px' , fontWeight:'bold'}}>{new Date(seance.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12: false})}</option>
            ))}
          </CFormSelect>
      </CCol>
      </div>
      <div className='pt-5'>
      <button className='btn btn-primary w-25 'style={{float:'right' }} disabled={value===''} onClick={() => handleSubmit()}>Reserve</button>
      </div>
      </div>
    </div>
  )
}

export default ItemPage

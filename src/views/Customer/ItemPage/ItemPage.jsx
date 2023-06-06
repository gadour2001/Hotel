import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as axiosApi  from 'src/api/axiosApi'
import {
    CCol,
    CFormLabel,
    CFormSelect,
} from '@coreui/react'
import io from "socket.io-client"; 

const socket = io.connect("http://localhost:5001");

const GET_PRODUCT_URL = '/product/get/'
const GET_SEANCE_URL = '/seance/get/'
const POST_RESERVATION_URL = '/reservation/post'

const ItemPage = () => {
    const {idProduct , idService} = useParams()
    const idClient = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user._id:null

    const [product , setProduct] = useState({})
    const [nbrPlace , setNbrplace] = useState(1)
    const [seances , setSeances] = useState([])
    const [value , setValue] = useState('')
    const [time , setTime] = useState()
    const [date , setDate] = useState(new Date().toISOString().split('T')[0])

    const get_Product = (id) => {
        axiosApi.getBYID(GET_PRODUCT_URL, id )
        .then((res) =>{console.log(res); setProduct(res)})
        .catch((err) => console.log(err))
    }
    const get_Seance = (id) => {
        axiosApi.getSeance(GET_SEANCE_URL , id , { nbrPlace , date : date }) 
        .then((res) => {console.log(res); setSeances(res)})
        .catch((err) => console.log(err))
    }
    useEffect(() => {
      if(localStorage.getItem('user')){
        axiosApi.getSeance(GET_SEANCE_URL , idProduct , { nbrPlace , date : date }) 
        .then((res) => {console.log(res); setSeances(res)})
        .catch((err) => console.log(err))
      }
  }, [date,nbrPlace]);
    useEffect(() => {
        if(localStorage.getItem('user')){
            get_Product(idProduct)
        }
    }, [idProduct]);

    const NbrPlace = (value) => {
        if(!(nbrPlace == 1 && value == -1)){
            setNbrplace(nbrPlace + value)
        }
    }

    const handleSubmit = () => {
        const dateTime = `${date}T${time}:00`
        axiosApi.post(POST_RESERVATION_URL , {prixTotal : product.prix ,idClient,idService,horaire : dateTime,nbrPlace,idProduct : idProduct})
        .then((res) => {
          socket.emit("add_Reservation");
          get_Seance(idProduct)
        })
        .catch((err) => console.log(err))
    }

  return (
    <div className='card m-3 p-4'>      
    <div className='row p-2'>

      <img src={product.image}  className='col-xl-6 col-sm-12' alt={product.name} />
      <div className='col-xl-6 col-sm-12'>
      <h1>{product.name}</h1>
      <h6>Description : {product.description}</h6>
      <h4>Price : {product.prix}</h4>
      <p>Arrival</p>
      <input
        type="date"
        className='form-control p-2'
        value={date}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => {setDate(e.target.value)}}
        required
      />
      <div className="btn-group py-2 w-100" role="group" aria-label="First group">
        <button type="button" className="btn btn-success" onClick={() => NbrPlace(1)}>+</button>
        <input
          style={{ width: "60px" , textAlign:"center"}}
          type="text"
          value={nbrPlace}
          readOnly 
        />
        <button type="button" className="btn btn-danger" onClick={() => NbrPlace(-1)}>-</button>
      </div>
      <CCol className='col-xl-6 col-sm-12 w-100'>
          <CFormLabel htmlFor="validationCustom02">Available arrival times</CFormLabel>
          <CFormSelect
            aria-label="Default select example"
            onChange={(e) => {setTime(e.target.value);setValue(e.target.value)  }}
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

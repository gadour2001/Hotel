import React, { useState , useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CWidgetStatsC,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilChartPie,
  cilSpeedometer,
  cilBasket,
  cilUserFollow,
} from '@coreui/icons'
import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import * as axiosApi from 'src/api/axiosApi' 
import io from "socket.io-client"; 

const socket = io.connect("http://localhost:5001");

const GET_ORDER_URL = '/commande/get/Service/'
const UPDATE_COMMANDE_STATUS = '/commande/update/status/'

const GET_RESERVATION_URL = '/reservation/get/Service/'



const DashboardServiceManager = () => {
    const [orders, setOrders] = useState([])
    const [date , setDate] = useState(new Date().toISOString().split('T')[0])
    const [reservations, setReservations] = useState([])
    const idService = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idService:null

    const get_Order = (id) => {
        axiosApi.getBYID(GET_ORDER_URL , id)
        .then((res) => setOrders(res))
        .catch((err) => console.log(err))
    }

    const handleUpdateStatus  = (id,Status) => {
        axiosApi.put(UPDATE_COMMANDE_STATUS, id , {etat : Status}).then((res) => {
          socket.emit("Edit_Order")
          get_Order(idService)
        }).catch((err) => console.log(err))
    }
    useEffect(() => {
      if(localStorage.getItem('user')){
        get_Order(idService)
      }
    },[])
    useEffect(() => {
      socket.on("add_Order", () => {
        get_Order(idService)
      });
    }, [socket]);
    useEffect(() => {
      socket.on("Edit_Order", () => {
        get_Order(idService)
      });
    }, [socket]);

    const get_Reservation = (id) => {
      axiosApi.getBYID(GET_RESERVATION_URL , id)
      .then((res) => setReservations(res))
      .catch((err) => console.log(err))
    }

    useEffect(() => {
      if(localStorage.getItem('user')){
        get_Reservation(idService)
      }
    },[])
    useEffect(() => {
      socket.on("add_Reservation", () => {
        get_Reservation(idService)
      });
    }, [socket]);
    useEffect(() => {
      socket.on("Edit_Reservation", () => {
        get_Reservation(idService)
      });
    }, [socket]);
  return (
    <>
      <CRow>
        <CCol xs={12}>
        {orders.length > 0 ? (
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Orders</strong>
            </CCardHeader>
            <CCardBody>
              
                 <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Table N°</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>   
                      <CTableHeaderCell scope="col">Details</CTableHeaderCell>   
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {orders.map((order) => 
                    <CTableRow key={order._id} className={ order.etat === 'en attente' ? "table-warning" : "table-success"}>
                      <CTableDataCell>{order.date}</CTableDataCell>
                      <CTableDataCell>{order.prixTotal} DT</CTableDataCell>
                      <CTableDataCell>{order.numtable}</CTableDataCell>
                      <CTableDataCell>{
                        order.etat === 'en attente' ? <CButton color="warning" onClick={() => handleUpdateStatus(order._id,'en cours')}>On Progress</CButton> 
                        : <CButton color="success" onClick={() => handleUpdateStatus(order._id,'fini')}>Finished</CButton>
                      }</CTableDataCell>
                      <CTableDataCell><Link to={`/editOrder/${order._id}`}><CButton color="info">Details</CButton></Link></CTableDataCell>
                    </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        ) :("")}
        {reservations.length > 0 ? (
          <CCard className="mb-4">
            <CCardHeader>
              <div className='row'>
                  <h2 className="col-6" >Reservation</h2>
                <div className="col-6 "style={{ placeSelf: 'end',textAlign: '-webkit-right'}}>
                <input
                  type="date"
                  className='form-control p-2'
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {setDate(e.target.value)}}
                  style={{width:'200px'}}
                />
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
                <CTable striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Places Number</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {reservations.map((reservation) => 
                    <CTableRow key={reservation._id}>
                      <CTableDataCell>{new Date(reservation.horaire).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).split('/').reverse().join('-')}</CTableDataCell>
                      <CTableDataCell>{new Date(reservation.horaire).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12: false})}</CTableDataCell>
                      <CTableDataCell>{reservation.idServiceProduct}</CTableDataCell>
                      <CTableDataCell>{reservation.prixTotal} DT</CTableDataCell>
                      <CTableDataCell>{reservation.nbPlace}</CTableDataCell>
                      <CTableDataCell><CBadge color="info">Pending</CBadge></CTableDataCell>
                    </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          ) :("")}
        </CCol>
      </CRow>
    </>
  )
}

export default DashboardServiceManager

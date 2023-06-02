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
} from '@coreui/icons'
import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import * as axiosApi from 'src/api/axiosApi' 
import io from "socket.io-client"; 

const socket = io.connect("http://localhost:5001");

const GET_ORDER_URL = '/commande/get/Service/'
const UPDATE_COMMANDE_STATUS = '/commande/update/status/'


const DashboardServiceManager = () => {
    const [orders, setOrders] = useState([])
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
  return (
    <>
      <WidgetsDropdown />
      <CRow>
        <CCol xs={12}>
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
                      <CTableHeaderCell scope="col">N table</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>   
                      <CTableHeaderCell scope="col">Details</CTableHeaderCell>   
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {orders.length > 0 ?orders.map((order) => 
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
                    ): <CTableRow><CTableDataCell>Not Data Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default DashboardServiceManager

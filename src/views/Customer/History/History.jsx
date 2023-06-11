import React , { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CBadge,
  } from '@coreui/react'
import * as axiosApi from '../../../api/axiosApi'
import io from "socket.io-client"
import { Link, useNavigate } from 'react-router-dom'

const socket = io.connect("http://localhost:5001")

const UPDATE_CUSTOM_SOLD_URL = '/client/updateSold/'
const GET_ORDER_BY_CLIENT = '/commande/get/Client/'
const UPDATE_COMMANDE_STATUS = "/commande/update/status/"

const History = () => {

  const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const idCustom = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
    

    const get_Order_By_Client = (id) => {
        axiosApi.getBYID(GET_ORDER_BY_CLIENT , id)
        .then((res) =>setOrders(res))
        .catch((err) => console.log(err))
    }
    const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
    useEffect(() => {
      if(localStorage.getItem('user')){
        if(Client.isActive == false)
        {
          navigate('/wait')
        }else{
          get_Order_By_Client(idCustom)
        } 
      }
    },[idCustom])

    const handleUpdate = (id) => {
        axiosApi.put(UPDATE_COMMANDE_STATUS, id , {etat : 'annuler'}).then((res) => {
          axiosApi.put(UPDATE_CUSTOM_SOLD_URL , idCustom , {sold : res.updatedOrder.prixTotal}).then((res) => {
            get_Order_By_Client(idCustom)
            socket.emit("Edit_Order")
          })
        }).catch((err) => console.log(err))
    }
    useEffect(() => {
      socket.on("Edit_Order", () => {
        get_Order_By_Client(idCustom)
      })
    }, [socket])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
            <div className='row'>
                    <h2 className="col-6" >Orders</h2>
                </div>
            </CCardHeader>
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Table N°</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Details</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {orders.length > 0 ?orders.map((order) => 
                    <CTableRow key={order._id} className={ order.etat === 'fini' ? "table-success" :
                    order.etat === 'en cours' ? "table-warning" :"table-info"}>
                      <CTableDataCell>{order.date}</CTableDataCell>
                      <CTableDataCell>{order.prixTotal} DT</CTableDataCell>
                      <CTableDataCell>{order.numtable}</CTableDataCell>
                      <CTableDataCell>{
                        order.etat === 'fini' ? <CBadge color="success">Finished</CBadge> 
                        : order.etat === 'en attente' ? <CBadge color="info" >Pending</CBadge>
                        : order.etat === 'en cours' ? <CBadge color="warning">On Progress</CBadge>
                        : <CBadge color="warning">Cancel</CBadge>
                      }</CTableDataCell>
                      <CTableDataCell>{order.etat === 'en attente' ? (<CButton color="danger" onClick={() => handleUpdate(order._id)}>Cancel</CButton>) : "..."}</CTableDataCell>
                      <CTableDataCell><Link to={`/editOrder/${order._id}`}><CButton color="secondary">Details</CButton></Link></CTableDataCell>
                    </CTableRow>
                    ): <CTableRow><CTableDataCell colSpan={6} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default History

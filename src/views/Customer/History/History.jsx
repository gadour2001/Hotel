import React , { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableCaption,
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

const GET_ORDER_BY_CLIENT = '/commande/get/Client/'
const UPDATE_COMMANDE_STATUS = "/commande/update/status/"

const History = () => {

    const [orders, setOrders] = useState([])
    const idCustom = JSON.parse(localStorage.getItem('user')).user.payload.user._id
  

    const get_Order_By_Client = (id) => {
        axiosApi.getBYID(GET_ORDER_BY_CLIENT , id)
        .then((res) =>setOrders(res))
        .catch((err) => console.log(err))
    }
    
    useEffect(() => {
        get_Order_By_Client(idCustom)
    },[idCustom])

    const handleUpdate = (id) => {
        axiosApi.put(UPDATE_COMMANDE_STATUS, id , {etat : 'annuler'}).then((res) => {
          get_Order_By_Client(idCustom)
          socket.emit("Edit_Order")
        }).catch((err) => console.log(err))
    }
    useEffect(() => {
      socket.on("Edit_Order", () => {
        get_Order_By_Client(idCustom)
      });
    }, [socket]);
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Order</strong>
            </CCardHeader>
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">N table</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      <CTableHeaderCell scope="col">DETAILS</CTableHeaderCell>
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

export default History

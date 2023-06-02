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
import { Link } from 'react-router-dom'

const DELETE_ORDER_URL = '/commande/delete/'
const GET_ORDER_FINI_URL = '/commande/get/Servicefini/'

const Order = () => {
  
    const idService = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idService:null
    const [orders, setOrders] = useState([])

    const get_Order_fini = (id) => {
        axiosApi.getBYID(GET_ORDER_FINI_URL , id)
        .then((res) => setOrders(res))
        .catch((err) => console.log(err))
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    const handleDelete = async (id) => {
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          axiosApi.del(DELETE_ORDER_URL , id)
          .then(() => setOrders(orders.filter((order) => order._id !== id)))
          .catch((err) => console.log(err))
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
      }) 
    }
    useEffect(() => {
      if(localStorage.getItem('user')){
        get_Order_fini(idService)
      }
    },[])
  return (
    <>
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
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">N table</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Details</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {orders.length > 0 ?orders.map((order) => 
                    <CTableRow key={order._id} className={ order.etat === 'fini' ? "table-success" : "table-danger"}>
                      <CTableDataCell>{order.date}</CTableDataCell>
                      <CTableDataCell>{order.prixTotal}</CTableDataCell>
                      <CTableDataCell>{order.numtable}</CTableDataCell>
                      <CTableDataCell>{
                        order.etat === 'fini' ? <CBadge color="success">finished</CBadge> 
                        : <CBadge color="danger">cancel</CBadge>
                      }</CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => handleDelete(order._id)}>Delete</CButton></CTableDataCell>
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

export default Order

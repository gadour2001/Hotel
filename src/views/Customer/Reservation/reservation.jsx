import React, { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
  
  const socket = io.connect("http://localhost:5001")

const GET_RESERVATION_BY_CLIENT = '/reservation/get/Client/'

const Reservation = () => {
    const navigate = useNavigate()
    const [reservations, setReservations] = useState([])
    const idCustom = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
    

    const get_Reservation_By_Client = (id) => {
        // axiosApi.getBYID(GET_RESERVATION_BY_CLIENT , id)
        // .then((res) =>setReservations(res))
        // .catch((err) => console.log(err))
    }
    const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
    useEffect(() => {
      if(localStorage.getItem('user')){
        if(Client.isActive == false)
        {
          navigate('/wait')
        }else{
            get_Reservation_By_Client(idCustom)
        } 
      }
    },[idCustom])

    const handleUpdate = (id) => {
        axiosApi.put('UPDATE_COMMANDE_STATUS', id , {etat : 'annuler'}).then((res) => {
          axiosApi.put('UPDATE_CUSTOM_SOLD_URL' , idCustom , {sold : res.updatedOrder.prixTotal}).then((res) => {
            get_Reservation_By_Client(idCustom)
            socket.emit("Edit_Reservation")
          })
        }).catch((err) => console.log(err))
    }
    
    useEffect(() => {
      socket.on("Edit_Reservation", () => {
        get_Reservation_By_Client(idCustom)
      })
    }, [socket])

  return (
    <>
    <CRow>
        <CCol xs={12}>
            <CCard className="mb-4">
                <CCardHeader>
                <div className='row'>
                    <h2 className="col-6" >Reservation</h2>
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
                        {reservations.length > 0 ? reservations.map((reservation) => 
                        <CTableRow key={reservation._id}>
                        <CTableDataCell>{new Date(reservation.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).split('/').reverse().join('-')}</CTableDataCell>
                        <CTableDataCell>{new Date(reservation.horaire).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12: false})}</CTableDataCell>
                        <CTableDataCell>{reservation.idServiceProduct}</CTableDataCell>
                        <CTableDataCell>{reservation.prixTotal} DT</CTableDataCell>
                        <CTableDataCell>{reservation.nbPlace}</CTableDataCell>
                        <CTableDataCell>{reservation.etat === 'en attente' ? (<CButton color="danger" onClick={() => handleUpdate(reservation._id)}>Cancel</CButton>) : (<CBadge color="info">Finiched</CBadge>)}</CTableDataCell>
                        </CTableRow>
                        ): <CTableRow><CTableDataCell  colSpan={6} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
                    </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
    </>
  )
}

export default Reservation

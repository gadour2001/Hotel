import React, { useEffect, useState } from 'react'
import ReactSwitch from 'react-switch'
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
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilMoney } from '@coreui/icons'
import * as axiosApi  from 'src/api/axiosApi'


const GET_ALL_CLIENTS_URL = '/client/getByResponsable/'
const UPDATE_CUSTOM_SOLD_URL = '/client/updateSold/'
const UPDATE_CUSTOM_STATUS_URL = '/client/put/status/'
const ADD_LOG_URL = '/log/postLog'

const Client = () => {

  const [clients ,setClients] = useState([])
  const idManager = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
  const idAdmin = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idAdmin:null

    const get_Clients = (id) => {
      axiosApi.getBYID(GET_ALL_CLIENTS_URL , id)
      .then((res) => {
        setClients(res)
      }).catch((err) => console.log(err))
        
    }

    const updateCustomStatus = async (id) => {
        setClients((prevState) =>
          prevState.map((client) =>
          client._id === id
              ? {
                  ...client,
                  isActive: !client.isActive,
                }
              : client
          )
        )
        const etatclient = !(clients.find((client) => client._id === id).isActive)
        axiosApi.put(UPDATE_CUSTOM_STATUS_URL , id , {isActive: etatclient})
        .then(() => { console.log('Custom status updated successfully.')
        }).catch((error) => console.error('Error updating service status:', error))
    }
    
    const UpdateSold = async (id) => {
      const { value: sold } = await Swal.fire({
        title: 'Add Balance ',
        input: 'number',
        inputLabel: '',
        inputPlaceholder: 'Enter New Balance'
      })
      
      if (sold) {
        Swal.fire({
          title:`Balance Entered : ${sold} DT`,
          icon: 'success',
        })
        axiosApi.put(UPDATE_CUSTOM_SOLD_URL , id , {sold : sold})
        .then((res) => {
          console.log(id);
          axiosApi.post(ADD_LOG_URL, { idClient : id , idResponsable : idManager , sold : sold }).then((res) => {
            console.log(res)
          }).catch((err) => console.log(err))
          setClients((prevState) =>
            prevState.map((client) =>
            client._id === id ? {
                  ...client,
                  solde: parseFloat(client.solde) + parseFloat(sold),
                }: client
          )
        )})
      }
    }
    useEffect(() =>{
      if(localStorage.getItem('user')){
        get_Clients(idAdmin)
      }
    },[])
    
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Customers</strong>
            </CCardHeader>
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Passport ID / ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date of entry</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Stay</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Room N°</CTableHeaderCell>
                      <CTableHeaderCell scope="col">ON / OFF</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Add Balance</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {clients.length > 0 ? clients.map((client) => 
                    <CTableRow key={client._id} className={ client.isActive === true ? "table-success" : "table-danger"}>
                      <CTableDataCell>{client.username}</CTableDataCell>
                      <CTableDataCell>{client.email}</CTableDataCell>
                      <CTableDataCell>{new Date(client.dateBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).split('/').reverse().join('-')}</CTableDataCell>
                      <CTableDataCell>{client.idPassport}</CTableDataCell>
                      <CTableDataCell>{client.dateEntre}</CTableDataCell>
                      <CTableDataCell>{client.nbrJour}</CTableDataCell>
                      <CTableDataCell>{client.solde}</CTableDataCell>
                      <CTableDataCell>{client.numChambre}</CTableDataCell>
                      <CTableDataCell><ReactSwitch
                            checked={client.isActive === true}
                            onChange={() => {
                              updateCustomStatus(client._id)
                            }}
                        /></CTableDataCell>
                      <CTableDataCell>{client.isActive === true ? (<CButton color='info' onClick={() => UpdateSold(client._id)}><CIcon icon={cilMoney} className="me-2" />Add Balance</CButton>) : ""}</CTableDataCell>
                      </CTableRow>
                    ) : <CTableRow><CTableDataCell colSpan={10} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Client

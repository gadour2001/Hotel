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
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilMoney } from '@coreui/icons'
import * as axiosApi  from 'src/api/axiosApi'


const GET_ALL_CLIENTS_URL = '/client/getByResponsable'
const UPDATE_CUSTOM_SOLD_URL = '/client/updateSold/'
const UPDATE_CUSTOM_STATUS_URL = '/client/put/status/'

const Client = () => {

  const [clients ,setClients] = useState([])
    const get_Clients = () => {
        axiosApi.get(GET_ALL_CLIENTS_URL)
        .then((res) => setClients(res))
        .catch((err) => console.log(err))
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
        title: 'Input Sold ',
        input: 'number',
        inputLabel: 'New Sold',
        inputPlaceholder: 'Enter New Sold'
      })
      
      if (sold) {
        Swal.fire({
          title:`Entered Soled : ${sold} DT`,
          icon: 'success',
        })
        axiosApi.put(UPDATE_CUSTOM_SOLD_URL , id, {sold : sold})
        .then((res) => setClients((prevState) =>
          prevState.map((client) =>
          client._id === id
              ? {
                  ...client,
                  solde: parseFloat(client.solde) + parseFloat(sold),
                }
              : client
          )
        ))
      }
    }
    useEffect(() =>{
        get_Clients()
    },[])
    
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Client</strong>
            </CCardHeader>
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Passport</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date-Enter</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Stay</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Solde</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Room Num</CTableHeaderCell>
                      <CTableHeaderCell scope="col">ON / OFF</CTableHeaderCell>
                      <CTableHeaderCell scope="col">ADD SOLDE</CTableHeaderCell>
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
                      <CTableDataCell>{client.numChamber}</CTableDataCell>
                      <CTableDataCell><ReactSwitch
                            checked={client.isActive === true}
                            onChange={() => {
                              updateCustomStatus(client._id)
                            }}
                        /></CTableDataCell>
                      <CTableDataCell>{client.isActive === true ? (<CButton color='info' onClick={() => UpdateSold(client._id)}><CIcon icon={cilMoney} className="me-2" />ADD SOLDE</CButton>) : ""}</CTableDataCell>
                      </CTableRow>
                    ) : <CTableRow><CTableDataCell>Not Data Found</CTableDataCell></CTableRow>}
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

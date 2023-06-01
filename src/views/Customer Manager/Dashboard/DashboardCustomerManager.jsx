import React , { useState , useEffect }from 'react'
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
import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import Swal from 'sweetalert2'
import * as axiosApi from 'src/api/axiosApi'
import io from "socket.io-client";

const socket = io.connect("http://localhost:5001");

const GET_TODAY_CUSTOM_URL = '/client/get/'

const DashboardCustomerManager = () => {

  const [clients , setClients] = useState([])

  const idManager = JSON.parse(localStorage.getItem('user')).user.payload.user._id
  
  const handleUpdate = async (id) => {
    const { value: formValues } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        '<label >Sold</label><input id="sold" class="swal2-input"></br>' +
        '<label>Stay</label><input id="stay" class="swal2-input"></br>' +
        '<label>Num Chambre</label><input id="room" class="swal2-input">' ,
      focusConfirm: false,
      preConfirm: () => {
        const solde =   document.getElementById('sold').value
        const nbrJour =   document.getElementById('stay').value
        const numChambre =   document.getElementById('room').value
        axiosApi.put('/client/edit/' , id , {sold : solde , nbrJour : nbrJour , numChambre : numChambre})
        .then((res) => {
          socket.emit("valid_Custom")
          get_Custom(idManager)
        })
        .catch((err) => console.log(err))
      }
    })
    
    if (formValues) {
      Swal.fire('Accepted')
    }

  }

  const get_Custom = (id) => {
    axiosApi.getBYID(GET_TODAY_CUSTOM_URL,id)
    .then((res) => {
      setClients(res)
    })
    .catch((err) => {
      console.log(err)
    });
  }
  useEffect(() => {
    get_Custom(idManager)
  }, [])

  useEffect(() => {
    socket.on("add_Custom", () => {
      get_Custom(idManager)
    });
  }, [])

  return (
    <>
      <WidgetsDropdown />
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
                      <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
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
                      <CTableDataCell><CButton color='info' onClick={() => handleUpdate(client._id)}>Validation</CButton></CTableDataCell>
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

export default DashboardCustomerManager

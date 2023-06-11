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
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormLabel,
  CWidgetStatsC
  
} from '@coreui/react'
import * as axiosApi from 'src/api/axiosApi'
import io from "socket.io-client";
import CIcon from '@coreui/icons-react'
import { cilBasket, cilChartPie, cilSpeedometer, cilUserFollow } from '@coreui/icons'

const socket = io.connect("http://localhost:5001");

const GET_CUSTOM_URL = '/client/get/'
const UPDATE_CUSTOM_URL = '/client/edit/'
const ADD_LOG_URL = '/log/postLog'

const DashboardCustomerManager = () => {

  const [visible, setVisible] = useState(false)

  const [clients , setClients] = useState([])
  const [client , setClient] = useState([])

  const [sold , setSold] = useState(0)
  const [nbrJour , setNbrJour] = useState(1)
  const [numChambre , setNumChambre] = useState(0)

  const idManager = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
  
  const handleUpdate = async () => {
    axiosApi.put( UPDATE_CUSTOM_URL, client , {sold : sold , nbrJour : nbrJour , numChambre : numChambre})
    .then((res) => {
      axiosApi.post(ADD_LOG_URL, { idClient : client , idResponsable : idManager , sold : sold }).then((res) => {
        setVisible(false)
        socket.emit("valid_Custom")
        get_Custom(idManager)
      }).catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
  }

  const get_Custom = (id) => {
    axiosApi.getBYID(GET_CUSTOM_URL,id)
    .then((res) => {
      setClients(res)
    })
    .catch((err) => {
      console.log(err)
    });
  }
  useEffect(() => {
    if(localStorage.getItem('user')){
    get_Custom(idManager)
    }
  }, [])

  useEffect(() => {
    socket.on("add_Custom", () => {
      get_Custom(idManager)
    });
  }, [])

  return (
    <>
      <CRow>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="success"
                icon={<CIcon icon={cilUserFollow} height={36} />}
                value="385"
                title="New Clients"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="warning"
                icon={<CIcon icon={cilBasket} height={36} />}
                value="1238"
                title="Products sold"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="primary"
                icon={<CIcon icon={cilChartPie} height={36} />}
                value="28%"
                title="Returning Visitors"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="danger"
                icon={<CIcon icon={cilSpeedometer} height={36} />}
                value="5:34:11"
                title="Avg. Time"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
          </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Customer</strong>
            </CCardHeader>
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Passport ID / ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
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
                      <CTableDataCell><CButton color='info' onClick={() => {setVisible(true);setClient(client._id)}}>Validation</CButton></CTableDataCell>
                      </CTableRow>
                    ) : <CTableRow><CTableDataCell colSpan={5} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal scrollable visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Customer Validation</CModalTitle>
          </CModalHeader>
          <CModalBody>
          <CCol md={4}>
            <CFormLabel htmlFor="validationCustom01">Sold</CFormLabel>
            <CFormInput 
              type="number" 
              id="validationCustom05" 
              defaultValue={0}
              onChange={(e) => setSold(e.target.value)}
              required 
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="validationCustom01">Stay</CFormLabel>
            <CFormInput 
              type="number" 
              id="validationCustom05" 
              defaultValue={1}
              onChange={(e) => setNbrJour(e.target.value)}
              required 
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="validationCustom01">Num Room</CFormLabel>
            <CFormInput 
              type="number" 
              id="validationCustom05" 
              defaultValue={0}
              onChange={(e) => setNumChambre(e.target.value)}
              required 
            />
          </CCol>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => handleUpdate()} >Accept</CButton>
          </CModalFooter>
        </CModal>
    </>
  )
}

export default DashboardCustomerManager

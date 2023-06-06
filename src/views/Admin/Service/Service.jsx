import React, { useEffect , useState } from 'react'
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
import { DocsExample } from 'src/components'
import * as axiosApi  from 'src/api/axiosApi'
import CIcon from '@coreui/icons-react'
import { cilPlaylistAdd } from '@coreui/icons'
import { Link } from 'react-router-dom'

const GET_ALL_SERVISES_BY_ADMIN_URL = '/service/admin/'
const UPDATE_SERVICE_STATUS_URL = '/service/putStatus/'
const DELETE_SERVICE_URL = '/service/delete/'

const Service = () => {

    const [services, setServices] = useState([])
    const idAdmin = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
    const get_Service = (id) => {
        axiosApi.getBYID(GET_ALL_SERVISES_BY_ADMIN_URL,id)
        .then((res) => setServices(res))
        .catch((err) => console.log(err))
    }

    const updateServiceStatus = async (id) => {
        setServices((prevState) =>
          prevState.map((service) =>
            service._id === id
              ? {
                  ...service,
                  isActive: !service.isActive,
                }
              : service
          )
        )
        const etatservice = !(services.find((service) => service._id === id).isActive)
        axiosApi.put(UPDATE_SERVICE_STATUS_URL , id , {isActive: etatservice})
        .then(() => { console.log('Service status updated successfully.')
        }).catch((error) => console.error('Error updating service status:', error))
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
          axiosApi.del(DELETE_SERVICE_URL , id)
          .then(() => {
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            setServices(services.filter((service) => service._id !== id))
          })
          .catch((err) => console.log(err))
        } else if (result.dismiss === Swal.DismissReason.cancel) {
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
        get_Service(idAdmin)
      }
    },[])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className='row'>
                <h2 className="col-6" >Service</h2>
              <div className="col-6 "style={{textAlign:'end'}}>
                <Link to='/service/addService/0'><CButton color="info"><CIcon icon={cilPlaylistAdd} className="me-2" />Add Service</CButton></Link>
              </div></div>
            </CCardHeader>
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">ACTIVATE / DESACTIVATE</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Update</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {services.length > 0 ?services.map((service) => 
                    <CTableRow key={service._id} className={ service.isActive === true ? "table-success" : "table-danger"}>
                      <CTableDataCell><img style={{height:'50px'}} src={service.image} alt={service.name} /></CTableDataCell>
                      <CTableDataCell>{service.name}</CTableDataCell>
                      <CTableDataCell><ReactSwitch
                            checked={service.isActive === true}
                            onChange={() => {
                                updateServiceStatus(service._id)
                            }}
                        /></CTableDataCell>
                      <CTableDataCell><Link to={`/service/addService/${service._id}`}><CButton color="warning">Update</CButton></Link></CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => handleDelete(service._id)}>Delete</CButton></CTableDataCell>
                    </CTableRow>
                    ): <CTableRow><CTableDataCell colSpan={5} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Service

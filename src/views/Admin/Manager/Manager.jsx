import React, { useEffect, useState } from 'react'
import * as axiosApi  from 'src/api/axiosApi'
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
  import { cilUserFollow } from '@coreui/icons'
import { Link } from 'react-router-dom'

const GET_SERVICE_URL = '/service/get/'
const GET_MANAGERS_SERVICE_URL = '/responsableService/ResponsableService/'
const GET_MANAGERS_CLIENT_URL = '/responsableClient/ResponsableClient/'
const DELETE_MANAGER_URL = '/user/delete/'

const Manager = () => {
    
    const [managers , setManagers] = useState([])
    const [managersService , setManagersService] = useState([])
    const [managersClient , setManagersClient] = useState([])

    const idAdmin = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null
    // const [service_name , setService_name] = useState('')

    const get_Manager = (id) => {
        axiosApi.getBYID(GET_MANAGERS_SERVICE_URL , id)
        .then((res) =>{console.log(res);setManagersService(res)})
        .catch((err) => console.log(err))
        axiosApi.getBYID(GET_MANAGERS_CLIENT_URL , id)
        .then((res) =>{console.log(res); setManagersClient(res)})
        .catch((err) => console.log(err))
        const mergedManagers = [...managersService, ...managersClient];
        setManagers(mergedManagers  )
        console.log(managers);
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    // const get_Service = (id) => {
    //   axiosApi.getBYID(GET_SERVICE_URL,id)
    //       .then((res) => setService_name(res.name))
    //       .catch((err) => console.log(err))
    // }
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
          axiosApi.del(DELETE_MANAGER_URL, id)
          .then(() => setManagers(managers.filter((manager) => manager._id !== id)))
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
        console.log(idAdmin)
        get_Manager(idAdmin)
      }
    },[])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Managers</strong>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link to='/manager/addManager/0'><CButton color="info"><CIcon icon={cilUserFollow} className="me-2" />Add Manager</CButton></Link>
                </div>
            </CCardHeader>
            <CCardBody>
                <CTable striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Update</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {managers.length > 0 ? managers.map((manager) => 
                    <CTableRow key={manager._id}>
                      <CTableDataCell>{manager.username}</CTableDataCell>
                      <CTableDataCell>{manager.email}</CTableDataCell>
                      <CTableDataCell>{new Date(manager.dateBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).split('/').reverse().join('-')}</CTableDataCell>
                      <CTableDataCell>{manager.role === 'responsableService' ? "Service Manager" : "Customer Manager"}</CTableDataCell>
                      <CTableDataCell><Link to={`/manager/addManager/${manager._id}`}><CButton color="warning">Update</CButton></Link></CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => handleDelete(manager._id)}>Delete</CButton></CTableDataCell>
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

export default Manager

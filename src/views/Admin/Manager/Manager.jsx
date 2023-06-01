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

const GET_ALL_MANAGERS_URL = '/user/Responsable'
const DELETE_MANAGER_URL = '/user/delete/'

const Manager = () => {
    
    const [managers , setManagers] = useState([])

    const get_Manager = () => {
        axiosApi.get(GET_ALL_MANAGERS_URL)
        .then((res) => setManagers(res))
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
        get_Manager()
    },[])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Manager</strong> <small>Basic example</small>
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
                      <CTableHeaderCell scope="col">Date-Birthday</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                      <CTableHeaderCell scope="col">UPDATE</CTableHeaderCell>
                      <CTableHeaderCell scope="col">DELETE</CTableHeaderCell>
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
                      <CTableDataCell><Link to={`/manager/addManager/${manager._id}`}><CButton color="warning">UPDATE</CButton></Link></CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => handleDelete(manager._id)}>DELETE</CButton></CTableDataCell>
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

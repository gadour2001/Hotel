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
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilUserFollow } from '@coreui/icons'
import { Link } from 'react-router-dom'

const GET_SERVICE_URL = '/service/get/'
const GET_MANAGERS_URL = '/user/getResponsables/'
const DELETE_MANAGER_URL = '/user/delete/'

const Manager = () => {
    
    const [managers , setManagers] = useState([])

    const idAdmin = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user._id:null

    const get_Manager = (id) => {
        axiosApi.getBYID(GET_MANAGERS_URL , id)
        .then((res) =>{
          setManagers([...res.responsableService , ...res.responsableClient])
        }).catch((err) => console.log(err))
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
        get_Manager(idAdmin)
      }
    },[])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className='row'>
                  <h2 className="col-6" >Manager</h2>
                <div className="col-6 "style={{textAlign:'end'}}>
                    <Link to='/manager/addManager/0'><CButton color="info"><CIcon icon={cilUserFollow} className="me-2" />Add Manager</CButton></Link>
                </div>
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
                    ) : <CTableRow><CTableDataCell colSpan={6} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
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

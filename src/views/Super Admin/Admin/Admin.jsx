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

const GET_ALL_ADMINS_URL = '/admin'
const DELETE_ADMIN_URL = '/admin/delete/'

const Admin = () => {
    
    const [admins , setAdmins] = useState([])

    const get_Admin = () => {
        axiosApi.get(GET_ALL_ADMINS_URL)
        .then((res) => setAdmins(res))
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
          axiosApi.del(DELETE_ADMIN_URL, id)
          .then(() => setAdmins(admins.filter((admin) => admin._id !== id)))
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
        get_Admin()
      }
    },[])
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Administrators</strong>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link to='/admin/addAdmin/0'><CButton color="info"><CIcon icon={cilUserFollow} className="me-2" />Add Administrator</CButton></Link>
                </div>
            </CCardHeader>
            <CCardBody>
                <CTable striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date of Birth</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Hotel Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Update</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {admins.length > 0 ? admins.map((admin) => 
                    <CTableRow key={admin._id}>
                      <CTableDataCell>{admin.username}</CTableDataCell>
                      <CTableDataCell>{admin.email}</CTableDataCell>
                      <CTableDataCell>{new Date(admin.dateBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).split('/').reverse().join('-')}</CTableDataCell>
                      <CTableDataCell>{admin.hotelName}</CTableDataCell>
                      <CTableDataCell><Link to={`/admin/addAdmin/${admin._id}`}><CButton color="warning">Update</CButton></Link></CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => handleDelete(admin._id)}>Delete</CButton></CTableDataCell>
                      </CTableRow>
                    ) : <CTableRow><CTableDataCell>Not Data Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Admin


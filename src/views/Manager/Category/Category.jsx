import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
//swalWithBootstrapButtons
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
import * as axiosApi from 'src/api/axiosApi'
import { Link } from 'react-router-dom'

const GET_CATEGORYS_BY_SERVICE_URL = '/category/getCtegorys/'
const DELETE_CATEGORY_URL = '/category/delete/'

const Category = () => {

    const [categorys , setCategorys] = useState([])
    const idService = JSON.parse(localStorage.getItem('user')).user.payload.user.idService
    
    const get_Category_Service = (id) => {
        axiosApi.getBYID(GET_CATEGORYS_BY_SERVICE_URL,id)   
        .then((res) => setCategorys(res))
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
          axiosApi.del(DELETE_CATEGORY_URL , id)
          .then(() => {
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            setCategorys(categorys.filter((category) => category._id !== id))
          })
          .catch((err) => {
            swalWithBootstrapButtons.fire(
              'Cancelled',
              'Your imaginary file is safe :)',
              'error'
            )
            console.log(err)
          })
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
        get_Category_Service(idService)
    })
 
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Category</strong>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to={'/category/addCategory/0'}><CButton color="info">Add Category</CButton></Link>
              </div>
            </CCardHeader>
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">UPDATE</CTableHeaderCell>
                      <CTableHeaderCell scope="col">DELETE</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {categorys.length > 0 ?categorys.map((category) => 
                    <CTableRow key={category._id}>
                      <CTableDataCell><img style={{width:70+'px'}} src={category.image} alt={category.name} /></CTableDataCell>
                      <CTableDataCell>{category.name}</CTableDataCell>
                      <CTableDataCell><Link to={`/category/addCategory/${category._id}`}><CButton color="warning">UPDATE</CButton></Link></CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => handleDelete(category._id)}>DELETE</CButton></CTableDataCell>
                    </CTableRow>
                    ): <CTableRow><CTableDataCell>Not Data Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Category

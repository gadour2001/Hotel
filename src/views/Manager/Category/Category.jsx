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
    const idService = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idService:null
    
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
      if (idService) {
        
        get_Category_Service(idService)
      }
    })
 
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className='row'>
                  <h2 className="col-6" >Category</h2>
                <div className="col-6 "style={{textAlign:'end'}}>
                  <Link to={'/category/addCategory/0'}><CButton color="info">Add Category</CButton></Link>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
                <CTable striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Update</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {categorys.length > 0 ?categorys.map((category) => 
                    <CTableRow key={category._id}>
                      <CTableDataCell><img style={{height:60+'px'}} src={category.image} alt={category.name} /></CTableDataCell>
                      <CTableDataCell>{category.name}</CTableDataCell>
                      <CTableDataCell>{category.type}</CTableDataCell>
                      <CTableDataCell><Link to={`/category/addCategory/${category._id}`}><CButton color="warning">Update</CButton></Link></CTableDataCell>
                      <CTableDataCell><CButton color="danger" onClick={() => handleDelete(category._id)}>Delete</CButton></CTableDataCell>
                    </CTableRow>
                    ): <CTableRow><CTableDataCell colSpan={4} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
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

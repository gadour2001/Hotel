import React , { useEffect, useState } from 'react'
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
    CBadge,
  } from '@coreui/react'
import * as axiosApi from '../../../api/axiosApi'
import { Link, useParams } from 'react-router-dom'

const GET_LIGNECOMMAND_URL = '/ligneCommande/get/'
const DELETE_LIGNECOMMAND_URL = '/ligneCommande/delete/'

const EditOrder = () => {
    const { id } = useParams()

    const role = JSON.parse(localStorage.getItem('user')).user.payload.user.role 
    const [lignes , setlignes] = useState([])

    useEffect(() => {
        axiosApi.getBYID(GET_LIGNECOMMAND_URL , id )
        .then((res) => setlignes(res))
        .catch((err) => console.log(err))
    },[id])

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

    const handleDelete = (id) => {
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
              axiosApi.del(DELETE_LIGNECOMMAND_URL , id)
              .then(() => setlignes(lignes.filter((ligne) => ligne._id !== id)))
              .catch((err) => console.log(err))
            } else if (result.dismiss === Swal.DismissReason.cancel ) {
              swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
              )
            }
          })
    }
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
                <strong>Command line</strong>
            </CCardHeader>  
            <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      {role === 'responsableService' ? (<CTableHeaderCell scope="col">DELETE</CTableHeaderCell>) : ""}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {lignes.length > 0 ? lignes.map((ligne) => 
                    <CTableRow key={ligne._id}>
                      <CTableDataCell>{ligne.idProduct.name}</CTableDataCell>
                      <CTableDataCell>{ligne.quantite}</CTableDataCell>
                      <CTableDataCell>{ligne.quantite * ligne.idProduct.prix} DT</CTableDataCell>
                      {role === 'responsableService' ? (<CTableDataCell><CButton color="danger" onClick={() => handleDelete(ligne._id)}>DELETE</CButton></CTableDataCell>) : ""}
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

export default EditOrder

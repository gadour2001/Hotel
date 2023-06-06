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
    CTableFoot,
  } from '@coreui/react'
import * as axiosApi from '../../../api/axiosApi'
import { Link, useParams } from 'react-router-dom'

const GET_LIGNECOMMAND_URL = '/ligneCommande/get/'
const DELETE_LIGNECOMMAND_URL = '/ligneCommande/delete/'
const GET_COMMANDE_URL = '/commande/getCommande/'

const EditOrder = () => {
    const { id } = useParams()

    const role = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.role:null
    const [lignes , setlignes] = useState([])
    const [Commande , setCommande] = useState({})

    const get_lignes = (id) => {
      axiosApi.getBYID(GET_LIGNECOMMAND_URL , id )
        .then((res) => setlignes(res))
        .catch((err) => console.log(err))
    }
    const get_order = () => {
      axiosApi.getBYID(GET_COMMANDE_URL , id )
        .then((res) => setCommande(res))
        .catch((err) => console.log(err))
    }

    useEffect(() => {
      if(localStorage.getItem('user')){
        get_lignes(id)
        get_order(id)
      }
    },[id,lignes.length])

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
              .then(() => {
                setlignes(lignes.filter((ligne) => ligne._id !== id))
                get_order(id)
              })
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
          <CCard  className="mb-4">
            <CCardHeader>
                <strong>Order Details</strong> {
                        Commande.etat === 'fini' ? <CBadge color="success">Finished</CBadge> 
                        : Commande.etat === 'en attente' ? <CBadge color="info" >Pending</CBadge>
                        : Commande.etat === 'en cours' ? <CBadge color="warning">On Progress</CBadge>
                        : <CBadge color="danger">Cancel</CBadge>
                      }
            </CCardHeader>  
            <div style={{border:'1px solid #d8dbe0',borderRadius:'20px',margin:'10px',padding:'20px'}}>

          
            <h5>Date : {new Date(Commande.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).split('/').reverse().join('-')}</h5>
            <h5>Table Number : {Commande.numtable}</h5>
            <CCardBody >
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      {role === 'responsableService' ? (<CTableHeaderCell scope="col">Delete</CTableHeaderCell>) : ""}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {lignes.length > 0 ? lignes.map((ligne) => 
                    <CTableRow key={ligne._id}>
                      <CTableDataCell>{ligne.idProduct.name}</CTableDataCell>
                      <CTableDataCell>{ligne.quantite}</CTableDataCell>
                      <CTableDataCell>{ligne.quantite * ligne.idProduct.prix} DT</CTableDataCell>
                      {role === 'responsableService' ? (<CTableDataCell><CButton color="danger" onClick={() => handleDelete(ligne._id)}>Delete</CButton></CTableDataCell>) : ""}
                    </CTableRow>
                    ): <CTableRow><CTableDataCell colSpan={3} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
                  </CTableBody>
                  <CTableFoot>
                    <CTableRow>
                      <CTableHeaderCell scope="col"></CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total : </CTableHeaderCell>
                      <CTableHeaderCell scope="col">{Commande.prixTotal} DT</CTableHeaderCell>
                    </CTableRow>
                  </CTableFoot>
                </CTable>
            </CCardBody>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default EditOrder

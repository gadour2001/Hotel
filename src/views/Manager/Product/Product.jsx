import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
  } from '@coreui/react'
  import {
    CButton,
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
import Swal from 'sweetalert2'

const GET_CATEGORYS_BY_SERVICE_URL = '/category/getCtegorys/'
const GET_PRODUCTS_BY_CATEGORY_URL = '/product/getCategory/'
const DELETE_PRODUCT_URL = '/product/delete/'
const UPDATE_PRODUCT_URL = '/materialproduct/editQuantity/' 

const Product = () => {

  const idService = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.idService:null
    const [categorys , setCategorys] = useState([])
    const [products , setProducts] = useState([])
    
    const get_Category_Service = (id) => {
        axiosApi.getBYID(GET_CATEGORYS_BY_SERVICE_URL,id)
        .then((res) => setCategorys(res))
        .catch((err) => console.log(err))
    }
    const get_Products_Category = (id) => {
        axiosApi.getBYID(GET_PRODUCTS_BY_CATEGORY_URL,id)
        .then((res) => setProducts(res))
        .catch((err) => console.log(err))
    }
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
          axiosApi.del(DELETE_PRODUCT_URL , id)
          .then(() => {
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            setProducts(products.filter((product) => product._id !== id))
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
      if(localStorage.getItem('user')){
        get_Category_Service(idService)
      }
    })
    const handleStock = async (idP , idC) => {  
      const { value: quantity } = await Swal.fire({
        title: 'Input Quantity ',
        input: 'number',
        inputLabel: 'New Quantity',
        inputPlaceholder: 'Enter New Quantity'
      })
      
      if (quantity > 0) {
        Swal.fire({
          title:`Entered Quantity : ${quantity} `,
          icon: 'success',
        })
        axiosApi.put(UPDATE_PRODUCT_URL , idP , {quantity:quantity})
        .then((res) => get_Products_Category(idC))
        .catch((err) => console.log(err))
      }
    }

  return (
    <>
      <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className='row'>
                  <h2 className="col-6" >Product</h2>
                <div className="col-6 "style={{textAlign:'end'}}>
                <Link to={'/product/addProduct/0/0'}><CButton color="info">Add Product</CButton></Link>
            </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
                Click the category below to show the products.
            </p>
               <CAccordion>{/* activeItemKey={'6470c277434676e323871bab'} */}
                {categorys.length > 0 ? categorys.map((category) => (
                <CAccordionItem itemKey={category._id} key={category._id} onClick={() => get_Products_Category(category._id)} >
                  <CAccordionHeader>{category.name}</CAccordionHeader>
                  <CAccordionBody>
                    <CTable striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Type of Product</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Update</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                        <CTableHeaderCell scope="col"><Link to={`/product/addProduct/0/${category._id}`}><CButton color="info">Add Product</CButton></Link></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {products.length > 0 ? products.map((product) => (
                      <CTableRow key={product._id}>
                        <CTableDataCell><img style={{width:70+'px'}} src={product.image} alt={product.name} /></CTableDataCell>
                        <CTableDataCell>{product.name}</CTableDataCell>
                        <CTableDataCell>{product.prix} DT</CTableDataCell>
                        <CTableDataCell>{product.quantity == -1 ? "unlimited" : product.quantity}</CTableDataCell>
                        <CTableDataCell>{product.__t === 'materialProduct' ? "Consumable" : "Service"}</CTableDataCell>
                        <CTableDataCell><Link to={`/product/addProduct/${product._id}/${category._id}`}><CButton color="warning">Update</CButton></Link></CTableDataCell>
                        <CTableDataCell><CButton color="danger" onClick={() => handleDelete(product._id)}>Delete</CButton></CTableDataCell>
                        {product.quantity === -1 ? (<CTableDataCell></CTableDataCell>) : (<CTableDataCell><CButton color="success" onClick={() => handleStock(product._id,category._id)}>Add Quantity</CButton></CTableDataCell>)}
                      </CTableRow>
                      )) : <CTableRow><CTableDataCell  colSpan={8} style={{textAlign:'center'}}>Data Not Found</CTableDataCell></CTableRow>}
                    </CTableBody>
                  </CTable>
                  </CAccordionBody>
                </CAccordionItem>
                )) : ""}
              </CAccordion>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    </>
  )
}

export default Product

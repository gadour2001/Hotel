import { cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import cart from 'src/assets/images/cart.png'
import 'src/assets/css/cart.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardGroup,
  CCardHeader,
  CCardImage,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormText,
  CFormInput,
} from '@coreui/react'
import Swal from 'sweetalert2'
import React , { useState , useEffect } from 'react'
import * as axiosApi from 'src/api/axiosApi'
import { useNavigate } from 'react-router-dom'
import io from "socket.io-client";

const socket = io.connect("http://localhost:5001");

const POST_COMMANDE_URL = "/commande/post"
const POST_LIGNECOMMANDE_URL = "/ligneCommande/post"
const GET_PRODUCT_URL = '/product/get/'
const UPDATE_CUSTOM_SOLD_URL = '/client/updateSold/'
const UPDATE_PRODUCT_QUANTITY_URL = '/materialproduct/editQuantity/' 
const GET_CUSTOM_URL = '/user/get/'

const Cart = () => {
  const navigate = useNavigate()
  const idClient = JSON.parse(localStorage.getItem("user")).user.payload.user._id

  const [products, setProducts] = useState([])
  const [prixTotal, setPrixtotal] = useState(0)
  const [idService, setIdService] = useState("");

  useEffect(() => {
    let total = 0;
    const updatedProducts = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('product_')) {
        const product = JSON.parse(localStorage.getItem(key))
        updatedProducts.push(product);
        setIdService(product.idService);
        const prix = product.prix * product.quantity;
        total += prix;
      }
    }
    setProducts(updatedProducts);
    setPrixtotal(total);
  }, []);

  const handleClearAll = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('product_')) {
        localStorage.removeItem(key)
      }
    }
    setProducts([])
    setPrixtotal(0)
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })

  const handleCommande = () => {
    console.log(products);
    axiosApi.getBYID(GET_CUSTOM_URL, idClient).then( (res) => {

      const sold = res.solde
    if (sold >= prixTotal) {
        const numtable = '125'
        axiosApi.post(POST_COMMANDE_URL, { prixTotal, idClient, idService, numtable })
          .then((res) => {
            socket.emit("add_Order");
            const idCommand = res.commande._id;
            axiosApi.put(UPDATE_CUSTOM_SOLD_URL, idClient, { sold: -prixTotal })
              .then((res) => {                
                products.map( (product) => {
                   axiosApi.getBYID(GET_PRODUCT_URL, product._id).then((res) => {
                    if(res.quantity != -1) {
                      axiosApi.put(UPDATE_PRODUCT_QUANTITY_URL, product._id, { quantity: -(product.quantity) })
                        .then( () => {
                          console.log('updated quantity of ' + product.name)
                        }).catch((err) => console.log(err))
                    }
                  }).catch((err) => console.log(err))
                   axiosApi.post(POST_LIGNECOMMANDE_URL, { quantite: product.quantity, idCommande: idCommand, idProduct: product._id })
                    .then(() => {
                      console.log('ligne added ' + product.name)
                    }).catch((err) => console.log(err))
                })
                // handleClearAll();
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Your work has been saved',
                  showConfirmButton: false,
                  timer: 1500
                })
              }).catch((err) => console.log(err))
          }).catch((err) => console.log(err))
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Insufficient balance',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  const handleDelete = (product) => {
    Toast.fire({
      icon: 'error',
      title: 'Delete successfully'
    })
    localStorage.removeItem(`product_${product._id}`)
    const newProducts = products.filter((p) => p._id !== product._id)
    let total = 0;
    newProducts.forEach((p) => {
      const prix = p.prix * p.quantity
      total += prix;
    })
    setPrixtotal(total);
    setProducts(newProducts)
  }

  const UpdateQuantity = (e, product) => {
    const newQuantity = parseInt(e.target.value);
    const newProducts = products.map((p) => {
      if (p._id === product._id) {
        const cartItem = JSON.parse(localStorage.getItem(`product_${product._id}`))
        localStorage.setItem(`product_${product._id}`,
          JSON.stringify({
            ...cartItem,
            quantity: newQuantity,
          })
        )
        return { ...p, quantity: newQuantity }
      }
      return p;
    });
    setProducts(newProducts);
    const newPrixtotal = newProducts.reduce(
      (total, p) => total + p.prix * p.quantity, 0
    );
    setPrixtotal(newPrixtotal);
  }
  return (
    <>
      <CRow >
        <CCol xs>
          <CCard className="mb-12">
            <CCardHeader>
              <strong>Cart</strong> <small>Example</small>
            </CCardHeader>
            <CCardBody xs="true">
            {products.length > 0 ? (
              <CRow>
                <CCol>
                    <CCard >
                        <CCardHeader>
                            <strong>My Cart</strong> <small>Example</small>
                        </CCardHeader>
                        <CCardBody>
                        <CTable striped>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {products.map((product) => (
                              <CTableRow key={product._id}>
                                <CTableDataCell>{product.name}</CTableDataCell>
                                <CTableDataCell>{product.prix} DT</CTableDataCell>
                                <CTableDataCell>
                                  {product.quantity === -1 ? 
                                    (<CFormInput 
                                      type="number" 
                                      defaultValue={product.quantity} 
                                      min={1}
                                      onChange={(e) => UpdateQuantity(e, product)}
                                      required 
                                    />) : 
                                    (<CFormInput 
                                      type="number" 
                                      defaultValue={product.quantity} 
                                      min={1}
                                      max={product.quantity}
                                      onChange={(e) => UpdateQuantity(e, product)}
                                      required 
                                    />)
                                  }
                                </CTableDataCell>
                                <CTableDataCell>{parseFloat(product.prix) * parseInt(product.quantity)} DT</CTableDataCell>
                                <CTableDataCell><CButton color="danger" onClick={() => handleDelete(product)}><CIcon icon={cilX} className="me-2"/></CButton></CTableDataCell>
                              </CTableRow>
                              ))}
                              <CTableRow>
                                <CTableDataCell  colSpan="3"><CButton color='warning' onClick={() => navigate('/serviceCustomer')}>Back to Shop</CButton></CTableDataCell>
                                <CTableDataCell>{prixTotal} DT</CTableDataCell>
                                <CTableDataCell><CButton color='info' onClick={() => handleCommande()}>Commander</CButton></CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                        </CCardBody>
                    </CCard>
                  </CCol>
              </CRow>
              ) : <div className='cart-empty'>
                    <img src={cart} alt='cart' />
                    <h2>Your cart is currently empty.</h2>
                  </div>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Cart

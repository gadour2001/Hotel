import { cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import cart from 'src/assets/images/cart.png'
import 'src/assets/css/cart.css'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
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
  CFormInput,
} from '@coreui/react'
import Swal from 'sweetalert2'
import React , { useState , useEffect , useContext, useRef } from 'react'
import * as axiosApi from 'src/api/axiosApi'
  import { cilQrCode } from '@coreui/icons'
  import { useNavigate } from 'react-router-dom'
import io from "socket.io-client";
import { Context } from 'src/components/context/contextProvider'
import QrScanner from 'react-qr-scanner';

const socket = io.connect("http://localhost:5001");

const POST_COMMANDE_URL = "/commande/post"
const GET_PRODUCT_URL = '/product/get/'
const GET_CUSTOM_URL = '/user/get/'


const Cart = () => {
  const navigate = useNavigate()
  const idClient = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user._id:null
  const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
  const [isScanning, setIsScanning] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState('');


  const handleScan = (result) => {
    if (result) {
      setQrCodeValue(result.text);
      setIsScanning(false);
      setNumtable(result.text);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Your are in the table N° ${result.text}`,
        showConfirmButton: false,
        timer: 1500
      })
    }
  };
  
  const handleError = (error) => {
    console.error('QR code scan error:', error);
  };

  const {changeData } = useContext(Context)

  const [products, setProducts] = useState([])
  const [prixTotal, setPrixtotal] = useState(0)
  const [idService, setIdService] = useState("")
  const [numtable, setNumtable] = useState("")

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if(Client){
      if(Client.isActive == false)
      {
        navigate('/wait')
      }else{
        changeData(localStorage.length - 1)
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
      }
  }
  }, []);

  const handleClearAll = () => {
    const userValue = localStorage.getItem('user');
    localStorage.clear(); 
    
    if (userValue) {
      localStorage.setItem('user', userValue);
    }
  
    changeData(localStorage.length - 1);
    setProducts([]);
    setPrixtotal(0);
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })


  const handleCommande = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    if(numtable == ""){
      Toast.fire({
        icon: 'error',
        title: 'Pleace check your table',
      });
    }else{
      axiosApi.getBYID(GET_CUSTOM_URL, idClient).then( (res) => {
        const sold = res.solde
        if (sold >= prixTotal) {
          axiosApi.post(POST_COMMANDE_URL, { prixTotal, idClient, idService, numtable , lignesCommandes : products})
            .then((res) => {
              socket.emit("add_Order");
              handleClearAll();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your Order has been Confirmed',
                showConfirmButton: false,
                timer: 1500
              })
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
        setVisible(false)
      })
    }
  }
  const handleDelete = (product) => {
    Toast.fire({
      icon: 'error',
      title: 'Successfully Deleted'
    })
    localStorage.removeItem(`product_${product._id}`)
    changeData(localStorage.length - 1)
    const newProducts = products.filter((p) => p._id !== product._id)
    let total = 0;
    newProducts.forEach((p) => {
      const prix = p.prix * p.quantity
      total += prix;
    })
    setPrixtotal(total);
    setProducts(newProducts)
  }

  const UpdateQuantity = (product , value) => {
    axiosApi.getBYID(GET_PRODUCT_URL, product._id).then((res) => {
    const newProducts = products.map((p) => {
      if (p._id === product._id) {
        const cartItem = JSON.parse(localStorage.getItem(`product_${product._id}`))
          if(res.quantity === -1){
            if(!(cartItem.quantity === 1 && value === -1)){
              localStorage.setItem(`product_${product._id}`,
              JSON.stringify({
                ...cartItem,
                quantity: cartItem.quantity + value,
              })
              )
              return { ...p, quantity: cartItem.quantity + value }
            }
          }else{
            if(res.quantity > cartItem.quantity || (res.quantity == cartItem.quantity && value == -1)){
              if(!(cartItem.quantity === 1 && value === -1)){
                localStorage.setItem(`product_${product._id}`,
                JSON.stringify({
                  ...cartItem,
                  quantity: cartItem.quantity + value,
                })
                )
                return { ...p, quantity: cartItem.quantity + value }
              }
            }
          }
      }
      return p;
    });
    
    setProducts(newProducts);
    const newPrixtotal = newProducts.reduce(
      (total, cartItem) => total + cartItem.prix * cartItem.quantity, 0
    );
    setPrixtotal(newPrixtotal);
    
  })
  }


  return (
    <>
    <CRow>
      <CCol>
        {products.length > 0 ? (
          <CCard >
            <CCardHeader>
               <strong>MY Wallet</strong>
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
                  <CTableBody style={{fontSize:'17px'}}>
                    {products.map((product) => (
                      <CTableRow key={product._id}>
                        <CTableDataCell>{product.name}</CTableDataCell>
                        <CTableDataCell>{product.prix} DT</CTableDataCell>
                        <CTableDataCell>
                          <div className="btn-group mr-2" role="group" aria-label="First group">
                            <button type="button" className="btn btn-success" onClick={() => UpdateQuantity(product , 1)}>+</button>
                            <input
                              style={{ width: "60px" , textAlign:"center"}}
                              type="text"
                              value={product.quantity}
                              readOnly 
                            />
                            <button type="button" className="btn btn-danger" onClick={() => UpdateQuantity(product , -1)}>-</button>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{parseFloat(product.prix) * parseInt(product.quantity)} DT</CTableDataCell>
                        <CTableDataCell><CButton color="secondary" onClick={() => handleDelete(product)}><CIcon icon={cilX} className="me-2"/></CButton></CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='my-2'>
                      <CTableDataCell  colSpan="3"><CButton color='warning' onClick={() => navigate('/serviceCustomer')}>Back to Shop</CButton></CTableDataCell>
                      <CTableHeaderCell>Total : {prixTotal} DT</CTableHeaderCell>
                      <CTableDataCell><CButton color='info' onClick={() => setVisible(!visible)} style={{width:'100%'}}>Order</CButton></CTableDataCell>
                    </CTableRow>
                  </CTableBody>
              </CTable>
                </CCardBody>
              </CCard>
            ) : <div className='cart-empty'>
                  <img src={cart} alt='cart' />
                  <h2>Your cart is currently empty.</h2>
                </div>}
          </CCol>
        </CRow>
        <CModal size="xl" scrollable visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>MY Order</CModalTitle>
          </CModalHeader>
          <CModalBody >
            <table style={{width:'100%',fontSize:'25px'}}>
              <thead>
              <tr className='m-2 '>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                </tr>
              </thead>
              <tbody >
              {products.map((product) => (
                <tr className='m-2' key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.prix} DT</td>
                  <td>{product.quantity}</td>
                  <td>{product.prix * product.quantity} DT</td>
                </tr>
              ))}
              </tbody>
              <tfoot>
              <tr className='3-2 '>
                <th style={{display: "flex"}}>
                    <CCol md={3}> 
                      <CFormInput 
                        type="text"
                        id="validationCustom01"
                        value={qrCodeValue}
                        placeholder='Table number'
                        onChange={(e) => setNumtable(e.target.value)}
                        required 
                        disabled
                      />
                    </CCol>
                    <CButton color="secondary" onClick={() => setIsScanning(prev => !prev)}> 
                      <CIcon icon={cilQrCode} className="me-2" />{isScanning ? 'Stop Scanning' : 'Scan QR Code'}
                    </CButton>
                </th>
                <th>
                </th>
                <th>Total : </th>
                <th>{prixTotal} DT</th>
              </tr>
              </tfoot>
          </table>
          <div>
            {isScanning && (
              <QrScanner
                onScan={handleScan}
                onError={handleError}
                facingmode="environment"
              />
            )}
        </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" onClick={() => handleCommande()}>Confirm</CButton>
          </CModalFooter>
        </CModal>
  
    </>
  )
}

export default Cart

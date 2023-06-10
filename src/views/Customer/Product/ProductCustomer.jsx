import React, { useState, useEffect ,useContext } from 'react';
import { useNavigate, useParams , Link } from 'react-router-dom';
import * as axiosApi from 'src/api/axiosApi';
import { Context } from 'src/components/context/contextProvider'
import {
  CCard,
  CCardFooter,
  CCardGroup,
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
  CButton,
  CCardBody,
  CCardHeader,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CTooltip,
  CBadge,
} from '@coreui/react';
import Swal from 'sweetalert2';
import { DocsExample } from 'src/components';

const GET_CATEGORYS_BY_SERVICE_URL = '/category/getCtegorys/';
const GET_PRODUCTS_BY_CATEGORY_URL = '/product/';
const GET_PRODUCT_URL = '/product/get/'

const ProductCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const [categorys, setCategorys] = useState([]);
  const [products, setProducts] = useState([]);

  const {changeData} = useContext(Context)
  
  useEffect(() => {
    if(localStorage.getItem('user')){
    const get_Category_Service = (id) => {
      axiosApi
        .getBYID(GET_CATEGORYS_BY_SERVICE_URL, id)
        .then((res) => setCategorys(res))
        .catch((err) => console.log(err))
    }
    get_Category_Service(id);
  }
  }, [id]);
  const Client = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).user.payload.user:null
  useEffect(() => {
    if(localStorage.getItem('user')){
        changeData(localStorage.length - 1)
        const get_Product_Category = () => {
          axiosApi
            .get(GET_PRODUCTS_BY_CATEGORY_URL)
            .then((res) => setProducts(res))
            .catch((err) => console.log(err))
        }
        get_Product_Category()
    }
  },[])

  

  const addtoCard = (product, Quant) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    
    const cartItem = localStorage.getItem(`product_${product._id}`);
  
    if (cartItem) {
      const cartProduct = JSON.parse(cartItem);
      if (Quant >= cartProduct.quantity + 1 || Quant === -1) {

        localStorage.setItem(
          `product_${product._id}`,
          JSON.stringify({
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
            idService: id,
          })
        );
        Toast.fire({
          icon: 'info',
          title: 'Increased item',
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'This item is not in stock',
        });
      }
    } else {
      localStorage.setItem(
        `product_${product._id}`,
        JSON.stringify({ ...product, quantity: 1, idService: id })
      );
      Toast.fire({
        icon: 'success',
        title: 'Added to cart',
      });
    }
    changeData(localStorage.length - 1)
  };

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-12">
            <CCardHeader>
              <span></span>
            </CCardHeader>
            <CCardBody>
              <h5>
              Our restaurant offers an extensive menu carefully crafted by our talented chefs, who skillfully blend international flavors with locally sourced ingredients. From gourmet appetizers to delectable main courses and mouthwatering desserts, our menu caters to diverse palates and dietary preferences. Whether you are a seafood lover, a vegetarian enthusiast, or an adventurous foodie, our restaurant has something to satisfy every craving.
              </h5>
              <div >
                {categorys.length > 0 ? (
                  categorys.map((category) => (
                    <div  key={category._id}>
                      <div style={{position:'relative'}} >
                        <img orientation="top" src={category.image} alt={category.name} style={{position:'absolute',right:'20px',top:'10px'}} height={70}/>
                        <div className='row card-body' style={{border:'1px solid #d8dbe0',borderRadius:'20px',margin:'10px'}} >
                          <CCardTitle>{category.name}</CCardTitle>
                          <CCardText>{category.description}</CCardText>
                          {products
                            .filter((product) => product.idCategorie  === category._id)
                            .map((product) => (
                              
                              <div className='text-center min-height-3 col-xl-3 col-md-6	col-lg-4 col-sm-12 my-2' style={{display: 'flex',flexDirection: 'column',alignSelf: 'end'}} key={product._id} >
                              {product.__t === 'materialProduct' ? (
                                <div >
                                  <CCardTitle>{product.name}</CCardTitle>
                                  <CCardTitle>{product.prix} DT</CCardTitle>
                                  <CCardText>{product.description}</CCardText>
                                  {product.quantity == 0 ? (<CButton color='danger' style={{width: '100%'}} disabled>Out of Stock</CButton>)
                                  : (<CButton style={{width: '100%'}} onClick={() => addtoCard(product,product.quantity)}>Add to Card</CButton>)}
                                </div>
                              ) : (
                                <div >
                                  <CCardTitle>{product.name}</CCardTitle>
                                  <CCardText>{product.description}</CCardText>
                                  <CCardTitle>{product.prix} DT</CCardTitle>
                                  <Link  to={`/serviceCustomer/productCustomer/itemPage/${id}/${product._id}`}><CButton style={{width: '100%'}}>Book Service</CButton></Link>
                                </div>
                              )}
                                
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <CCol>No data found</CCol>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ProductCustomer;

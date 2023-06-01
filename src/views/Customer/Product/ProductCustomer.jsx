import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as axiosApi from 'src/api/axiosApi';
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

  const [visible, setVisible] = useState(false)

  const [categorys, setCategorys] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const get_Category_Service = (id) => {
      axiosApi
        .getBYID(GET_CATEGORYS_BY_SERVICE_URL, id)
        .then((res) => setCategorys(res))
        .catch((err) => console.log(err))
    }
    get_Category_Service(id);
  }, [id]);

  useEffect(() => {
    const get_Product_Category = () => {
      axiosApi
        .get(GET_PRODUCTS_BY_CATEGORY_URL)
        .then((res) => setProducts(res))
        .catch((err) => console.log(err))
    }
    get_Product_Category()
  },[])
  // const get_Product = async (id) => {
  //   await axiosApi
  //     .getBYID(GET_PRODUCT_URL,id)
  //     .then((res) => setProduct(res))
  //     .catch((err) => console.log(err))
  // }
  // useEffect(() => {
  //   const productsInCart = []
  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i)
  //     if (key.startsWith('product_')) {
  //       const product = JSON.parse(localStorage.getItem(key))
  //       productsInCart.push(product);
  //     }
  //   }
  //   setCart(productsInCart)
  // }, []);

  const addtoCard = (product, Quant) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  
    const cartItem = localStorage.getItem(`product_${product._id}`);
    // const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
  
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
  
    // Update the cart state
    // const updatedCart = [...existingCart, product];
    // localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-12">
            <CCardHeader>
              <strong>Category</strong>
            </CCardHeader>
            <CCardBody>
              <CRow xs={{ cols: 1, gutter: 4 }} xl={{ cols: 3 }} md={{ cols: 2 }}>
                {categorys.length > 0 ? (
                  categorys.map((category) => (
                    <CCol xs key={category._id}>
                      <CCard>
                        <img orientation="top" src={category.image} alt={category.name} style={{position:'absolute',right:'20px',top:'10px'}} height={70}/>
                        <CCardBody>
                          <CCardTitle>{category.name}</CCardTitle>
                          <CCardText>{category.description}</CCardText>
                          {products
                            .filter((product) => product.idCategorie  === category._id)
                            .map((product) => (
                              <CCardBody key={product._id} >
                                <CCardTitle>{product.name}</CCardTitle>
                                <CCardText>{product.description}</CCardText>
                                {product.quantity === 0 ? (<CButton color='danger' disabled>Unavailable</CButton>)
                                 : (<CButton onClick={() => addtoCard(product,product.quantity)}  >Add to Card</CButton>)}
                              </CCardBody>
                            ))}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))
                ) : (
                  <CCol>No data found</CCol>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ProductCustomer;

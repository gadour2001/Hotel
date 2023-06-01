import React, { useState , useEffect } from 'react'
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
} from '@coreui/react'

import PropTypes from 'prop-types'
import CardProduct from 'src/components/Card/CardProduct'
import * as axiosApi from 'src/api/axiosApi'



const CardCategory = (props) => {
  const [products, setProducts] = useState([])
  console.log('gggg');
  const get_Product_Category = (id) => {
    axiosApi.getBYID(GET_PRODUCTS_BY_CATEGORY_URL,id)
    .then((res) => {
      setProducts(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  useEffect(() => {
    get_Product_Category(props.id)
  })
  return (
    <CCard>
      <CCardImage orientation="top" src="" alt={props.name} />
      <CCardBody>
        <CCardTitle>{props.name}</CCardTitle>
        <CCardText>{props.description}</CCardText>
        {products.map((product) => {
          <CCardBody>
            <CCardTitle>{product.name}</CCardTitle>
            <CCardText>{product.description}</CCardText>
          </CCardBody>
        })}
      </CCardBody>
    </CCard>
  )
}
CardCategory.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

export default CardCategory

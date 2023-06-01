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

const CardProduct = (props) => {
  return (
    <>
      <CCardBody>
        <CCardTitle>{props.products.name}</CCardTitle>
        <CCardText>{props.products.description}</CCardText>
      </CCardBody>
    </>
  )
}
CardProduct.propTypes = {
  products: PropTypes.object.isRequired,
};

export default CardProduct

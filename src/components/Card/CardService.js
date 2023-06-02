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
import 'src/assets/css/card.css'
import PropTypes from 'prop-types'

const CardService = (props) => {
  return (
    <CCard>
        <img orientation="top" src={props.image} alt={props.name} className='img' style={{height:'300px'}}/>
        <CCardBody>
          <CCardTitle>{props.name}</CCardTitle>
          <CCardText>{props.description}</CCardText>
        </CCardBody>
    </CCard>
  );
};

CardService.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CardService
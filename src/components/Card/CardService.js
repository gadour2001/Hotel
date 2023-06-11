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
    <CCard style={{borderRadius : '15px'}}>
        <h2 style={{color:'black',position:"absolute",bottom:"45%",width:'100%',background:"#ffffff95",textAlign:'center'}}>{props.name}</h2>
        <img orientation="top" src={props.image} alt={props.name} className='img' style={{height:'300px' ,borderRadius : '15px'}}/>
    </CCard>
  );
};

CardService.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default CardService
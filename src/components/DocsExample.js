import PropTypes from 'prop-types'
import React from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCode, cilMediaPlay } from '@coreui/icons'

const DocsExample = (props) => {
  const { children, href } = props


  return (
    <div className="example">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink href="serviceManager" active>
            <CIcon icon={cilMediaPlay} className="me-2" />
            Service Manager
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="" target="_blank">
            <CIcon icon={cilCode} className="me-2" />
            Customer Manager
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent className="rounded-bottom">
        <CTabPane className="p-3 preview" visible>
          {children}
        </CTabPane>
      </CTabContent>
    </div>
  )
}

DocsExample.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
}

export default React.memo(DocsExample)

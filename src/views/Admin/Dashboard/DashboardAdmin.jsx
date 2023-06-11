import React from 'react'
import {
  CChartBar,
  CChartPie,
} from '@coreui/react-chartjs'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CWidgetStatsC } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBasket, cilChartPie, cilSpeedometer, cilUserFollow } from '@coreui/icons'

const DashboardAdmin = () => {
  return (
    <div>
      <CRow>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="success"
                icon={<CIcon icon={cilUserFollow} height={36} />}
                value="385"
                title="New Clients"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="warning"
                icon={<CIcon icon={cilBasket} height={36} />}
                value="1238"
                title="Products sold"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="primary"
                icon={<CIcon icon={cilChartPie} height={36} />}
                value="28%"
                title="Returning Visitors"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={3}>
              <CWidgetStatsC
                color="danger"
                icon={<CIcon icon={cilSpeedometer} height={36} />}
                value="5:34:11"
                title="Avg. Time"
                inverse
                progress={{ value: 75 }}
                className="mb-4"
              />
            </CCol>
          </CRow>
          <CRow>
      <CCol lg={6} xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'GitHub Commits',
                    backgroundColor: '#f87979',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={6} xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Pie Chart</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: ['Red', 'Green', 'Yellow'],
                datasets: [
                  {
                    data: [300, 50, 100],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      </CRow>
    </div>
  )
}

export default DashboardAdmin

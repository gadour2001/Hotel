import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Vide = React.lazy(() => import('./views/page vide/PageVide'))

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="login/:id" name="Login Page" element={<Login />} />
            <Route path="register/:id" name="Register Page" element={<Register />} />
            <Route path="/404" name="Page 404" element={<Page404 />} />
            <Route path="/500" name="Page 500" element={<Page500 />} />
            <Route path="/*" name="Home" element={<DefaultLayout />} />
            <Route path="wait" name="Home" element={<Vide/>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App

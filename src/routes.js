import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const PageNotFound = React.lazy(() => import('./views/pages/page404/Page404'))

// Admin
const DashboardAdmin = React.lazy(() => import('./views/Admin/Dashboard/DashboardAdmin'))
const Service = React.lazy(() => import('./views/Admin/Service/Service'))
const AddService = React.lazy(() => import('./views/Admin/Service/AddService'))
const Manager = React.lazy(() => import('./views/Admin/Manager/Manager'))
const AddManager = React.lazy(() => import('./views/Admin/Manager/AddManager'))

// Customer Manager
const DashboardCustomerManager = React.lazy(() => import('./views/Customer Manager/Dashboard/DashboardCustomerManager'))
const Client = React.lazy(() => import('./views/Customer Manager/Customer/Client'))

// Service Manager 
const DashboardServiceManager = React.lazy(() => import('./views/Manager/Dashboard/DashboardServiceManager'))
const Order = React.lazy(() => import('./views/Manager/Order/Order'))
const EditOrder = React.lazy(() => import('./views/Manager/Order/EditOrder'))
const Category = React.lazy(() => import('./views/Manager/Category/Category'))
const AddCategory = React.lazy(() => import('./views/Manager/Category/addCategory'))
const Product = React.lazy(() => import('./views/Manager/Product/Product'))
const AddProduct = React.lazy(() => import('./views/Manager/Product/AddProduct'))

// Super Admin
const DashboardSuperAdmin = React.lazy(() => import('./views/Super Admin/Dashboard/DashboardSuperAdmin'))
const Admin = React.lazy(() => import('./views/Super Admin/Admin/Admin'))
const Profile = React.lazy(() => import('./views/Super Admin/Profile/Profile'))
const AddAdmin = React.lazy(() => import('./views/Super Admin/Admin/AddAdmin'))

// Customer
const Home = React.lazy(() => import('./views/Customer/Home/Home'))
const ServiceCustomer = React.lazy(() => import('./views/Customer/Service/ServiceCustomer'))
const ProductCustomer = React.lazy(() => import('./views/Customer/Product/ProductCustomer'))
const Cart = React.lazy(() => import('./views/Customer/Cart/cart'))
const History = React.lazy(() => import('./views/Customer/History/History'))
const Profil = React.lazy(() => import('./views/Customer/Profil/Profil'))

// Page Vide
let routes=[];
const role =  localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).user.payload.user.role:null
switch (role) {
  case 'client':
    routes = [

      { path: '/home', name: 'Home', element: Home },
      { path: '/serviceCustomer', name: 'Service', element: ServiceCustomer },
      { path: '/serviceCustomer/productCustomer/:id', name: 'Product', element: ProductCustomer },
      { path: '/cart', name: 'Cart', element: Cart },
      { path: '/history', name: 'History', element: History },
      { path: '/profil', name: 'Profil', element: Profil },
      { path: '/*', name: 'PageNotFound', element: PageNotFound },
    ]
    break;

  case 'superAdmin':
    routes = [

      { path: '/dashboardSuperAdmin', name: 'DashboardSuperAdmin', element: DashboardSuperAdmin },
      { path: '/admin', name: 'Admin', element: Admin },
      { path: '/admin/addAdmin/:id', name: 'AddAdmin', element: AddAdmin },
      { path: '/profileSuperAdmin', name: 'Profile', element: Profile },
      { path: '/*', name: 'PageNotFound', element: PageNotFound },
    ]
    break;

  case 'responsableClient':
    routes = [
      { path: '/dashboardCustomerManager', name: 'Dashboard', element: DashboardCustomerManager },
      { path: '/client', name: 'Customer', element: Client },
      { path: '/*', name: 'PageNotFound', element: PageNotFound },
    ]
    break;

  case 'responsableService':
    routes = [

      { path: '/dashboardServiceManager', name: 'DashboardServiceManager', element: DashboardServiceManager },
      { path: '/order', name: 'Order', element: Order },
      { path: '/editOrder/:id', name: 'EditOrder', element: EditOrder },
      { path: '/category', name: 'Category', element: Category },
      { path: '/category/addCategory/:id', name: 'AddCategory', element: AddCategory },
      { path: '/product', name: 'Product', element: Product },
      { path: '/product/addProduct/:idProduct/:idCategory', name: 'AddProduct', element: AddProduct },
      { path: '/*', name: 'PageNotFound', element: PageNotFound },
    ]
    break;

  case 'admin':
    routes = [
      { path: '/dashboardAdmin', name: 'DashboardAdmin', element: DashboardAdmin },
      { path: '/service', name: 'Service', element: Service },
      { path: '/service/addService/:id', name: 'AddService', element: AddService }, 
      { path: '/manager', name: 'Manager', element: Manager },
      { path: '/manager/addManager/:id', name: 'AddManager', element: AddManager },
      { path: '/*', name: 'PageNotFound', element: PageNotFound },
    ]
    break;
}
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', element: Colors },
  // { path: '/theme/typography', name: 'Typography', element: Typography },
  // { path: '/base', name: 'Base', element: Cards, exact: true },
  // { path: '/base/accordion', name: 'Accordion', element: Accordion },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', element: Cards },
  // { path: '/base/carousels', name: 'Carousel', element: Carousels },
  // { path: '/base/collapses', name: 'Collapse', element: Collapses },
  // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  // { path: '/base/navs', name: 'Navs', element: Navs },
  // { path: '/base/paginations', name: 'Paginations', element: Paginations },
  // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  // { path: '/base/popovers', name: 'Popovers', element: Popovers },
  // { path: '/base/progress', name: 'Progress', element: Progress },
  // { path: '/base/spinners', name: 'Spinners', element: Spinners },
  // { path: '/base/tables', name: 'Tables', element: Tables },
  // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  // { path: '/charts', name: 'Charts', element: Charts },
  // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },

 




export default routes

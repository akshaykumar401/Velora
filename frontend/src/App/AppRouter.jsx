import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import App from '../App.jsx'
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute.jsx'
import RouteFallback from '../components/section/RouteFallback.jsx'
import Home from '../pages/customerPages/Home.jsx'

const Shop = lazy(() => import('../pages/customerPages/Shop.jsx'))
const Category = lazy(() => import('../pages/customerPages/Category.jsx'))
const Collections = lazy(() => import('../pages/customerPages/Collections.jsx'))
const ProductDetail = lazy(() => import('../pages/customerPages/ProductDetail.jsx'))
const Cart = lazy(() => import('../pages/customerPages/Cart.jsx'))
const Wishlist = lazy(() => import('../pages/customerPages/Wishlist.jsx'))
const Checkout = lazy(() => import('../pages/customerPages/Checkout.jsx'))
const EditProfile = lazy(() => import('../pages/customerPages/EditProfile.jsx'))
const MyProfile = lazy(() => import('../pages/customerPages/MyProfile.jsx'))
const MyAddresses = lazy(() => import('../pages/customerPages/MyAddresses.jsx'))
const MyOrders = lazy(() => import('../pages/customerPages/MyOrders.jsx'))
const OrderDetails = lazy(() => import('../pages/customerPages/OrderDetails.jsx'))
const NotFound = lazy(() => import('../pages/customerPages/NotFound.jsx'))

const AboutUs = lazy(() => import('../pages/info/AboutUs.jsx'))
const ContactUs = lazy(() => import('../pages/info/ContactUs.jsx'))
const FAQ = lazy(() => import('../pages/info/FAQ.jsx'))
const ReturnRefundPolicy = lazy(() => import('../pages/info/ReturnRefundPolicy.jsx'))

const SignInPage = lazy(() => import('../pages/authenticationPages/SignInPage.jsx'))
const SignUpPage = lazy(() => import('../pages/authenticationPages/SignUpPage.jsx'))

const AdminLayout = lazy(() => import('../components/admin/AdminLayout.jsx'))
const AdminAuth = lazy(() => import('../pages/admin/AdminAuth.jsx'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'))
const ManageProducts = lazy(() => import('../pages/admin/ManageProducts.jsx'))
const AddProduct = lazy(() => import('../pages/admin/AddProduct.jsx'))
const AddCategory = lazy(() => import('../pages/admin/AddCategory.jsx'))
const ManageOrders = lazy(() => import('../pages/admin/ManageOrders.jsx'))
const AdminOrderDetails = lazy(() => import('../pages/admin/OrderDetails.jsx'))
const ManageReviews = lazy(() => import('../pages/admin/ManageReviews.jsx'))
const ManageStorefront = lazy(() => import('../pages/admin/ManageStorefront.jsx'))
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile.jsx'))

const lazyPage = (element) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: lazyPage(<Shop />) },
      { path: '/categories', element: lazyPage(<Category />) },
      { path: '/category', element: <Navigate to="/categories" replace /> },
      { path: '/collections', element: lazyPage(<Collections />) },
      { path: '/about', element: lazyPage(<AboutUs />) },
      { path: '/about-us', element: <Navigate to="/about" replace /> },
      { path: '/contact', element: lazyPage(<ContactUs />) },
      { path: '/contact-us', element: <Navigate to="/contact" replace /> },
      { path: '/shipping', element: lazyPage(<ReturnRefundPolicy />) },
      { path: '/returns', element: <Navigate to="/shipping" replace /> },
      { path: '/faq', element: lazyPage(<FAQ />) },
      { path: '/product/:id', element: lazyPage(<ProductDetail />) },
      {
        path: '/cart',
        element: <ProtectedRoute>{lazyPage(<Cart />)}</ProtectedRoute>,
      },
      {
        path: '/wishlist',
        element: <ProtectedRoute>{lazyPage(<Wishlist />)}</ProtectedRoute>,
      },
      {
        path: '/checkout',
        element: <ProtectedRoute>{lazyPage(<Checkout />)}</ProtectedRoute>,
      },
      {
        path: '/profile',
        element: <ProtectedRoute>{lazyPage(<MyProfile />)}</ProtectedRoute>,
      },
      {
        path: '/profile/edit',
        element: <ProtectedRoute>{lazyPage(<EditProfile />)}</ProtectedRoute>,
      },
      {
        path: '/addresses',
        element: <ProtectedRoute>{lazyPage(<MyAddresses />)}</ProtectedRoute>,
      },
      {
        path: '/orders',
        element: <ProtectedRoute>{lazyPage(<MyOrders />)}</ProtectedRoute>,
      },
      {
        path: '/orders/:id',
        element: <ProtectedRoute>{lazyPage(<OrderDetails />)}</ProtectedRoute>,
      },
      { path: '/sign-in/*', element: lazyPage(<SignInPage />) },
      { path: '/sign-up/*', element: lazyPage(<SignUpPage />) },
      { path: '/login', element: <Navigate to="/sign-in" replace /> },
      { path: '/register', element: <Navigate to="/sign-up" replace /> },
      { path: '/auth', element: <Navigate to="/sign-in" replace /> },
      { path: '*', element: lazyPage(<NotFound />) },
    ],
  },
  {
    path: '/admin/login',
    element: lazyPage(<AdminAuth />),
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>{lazyPage(<AdminLayout />)}</AdminProtectedRoute>
    ),
    children: [
      { index: true, element: lazyPage(<AdminDashboard />) },
      { path: 'products', element: lazyPage(<ManageProducts />) },
      { path: 'products/new', element: lazyPage(<AddProduct />) },
      { path: 'categories/new', element: lazyPage(<AddCategory />) },
      { path: 'orders', element: lazyPage(<ManageOrders />) },
      { path: 'orders/:id', element: lazyPage(<AdminOrderDetails />) },
      { path: 'reviews', element: lazyPage(<ManageReviews />) },
      { path: 'storefront', element: lazyPage(<ManageStorefront />) },
      { path: 'profile', element: lazyPage(<AdminProfile />) },
    ],
  },
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter


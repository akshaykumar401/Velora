import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ClerkAuthProvider } from './features/auth/ClerkAuthProvider.jsx'
import { StoreProvider } from './features/store/StoreProvider.jsx'
import { AdminProvider } from './features/admin/AdminProvider.jsx'
import { ProtectedRoute } from './components/auth'
import { AdminLayout, AdminProtectedRoute } from './components/admin'

// Pages Import
import {
  Home,
  Shop,
  Category,
  Collections,
  AboutUs,
  ContactUs,
  ReturnRefundPolicy,
  FAQ,
  NotFound,
  ProductDetail,
  Cart,
  Wishlist,
  Checkout,
  EditProfile,
  MyProfile,
  MyAddresses,
  MyOrders,
  OrderDetails,
  SignInPage,
  SignUpPage,
  AddCategory,
  AddProduct,
  AdminAuth,
  AdminDashboard,
  AdminProfile,
  ManageOrders,
  ManageProducts,
  ManageReviews,
  AdminOrderDetails,
} from './pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/shop',
        element: <Shop />,
      },
      {
        path: '/categories',
        element: <Category />,
      },
      {
        path: '/collections',
        element: <Collections />,
      },
      {
        path: '/about',
        element: <AboutUs />,
      },
      {
        path: '/about-us',
        element: <Navigate to="/about" replace />,
      },
      {
        path: '/contact',
        element: <ContactUs />,
      },
      {
        path: '/contact-us',
        element: <Navigate to="/contact" replace />,
      },
      {
        path: '/shipping',
        element: <ReturnRefundPolicy />,
      },
      {
        path: '/returns',
        element: <Navigate to="/shipping" replace />,
      },
      {
        path: '/faq',
        element: <FAQ />,
      },
      {
        path: '/product/:id',
        element: <ProductDetail />,
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: '/wishlist',
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/edit',
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/addresses',
        element: (
          <ProtectedRoute>
            <MyAddresses />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders/:id',
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: '/sign-in/*',
        element: <SignInPage />,
      },
      {
        path: '/sign-up/*',
        element: <SignUpPage />,
      },
      {
        path: '/login',
        element: <Navigate to="/sign-in" replace />,
      },
      {
        path: '/register',
        element: <Navigate to="/sign-up" replace />,
      },
      {
        path: '/auth',
        element: <Navigate to="/sign-in" replace />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminAuth />,
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'products',
        element: <ManageProducts />,
      },
      {
        path: 'products/new',
        element: <AddProduct />,
      },
      {
        path: 'categories/new',
        element: <AddCategory />,
      },
      {
        path: 'orders',
        element: <ManageOrders />,
      },
      {
        path: 'orders/:id',
        element: <AdminOrderDetails />,
      },
      {
        path: 'reviews',
        element: <ManageReviews />,
      },
      {
        path: 'profile',
        element: <AdminProfile />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkAuthProvider>
      <StoreProvider>
        <AdminProvider>
          <RouterProvider router={router} />
        </AdminProvider>
      </StoreProvider>
    </ClerkAuthProvider>
  </StrictMode>,
)

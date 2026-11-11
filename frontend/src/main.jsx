import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StoreProvider } from './features/store/StoreProvider.jsx'

// Pages Import
import { Home, Shop, Category, ProductDetail, Cart, Wishlist } from './pages'

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
        path: '/product/:id',
        element: <ProductDetail />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/wishlist',
        element: <Wishlist />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
)

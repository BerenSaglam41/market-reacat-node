import { createBrowserRouter, RouterProvider } from 'react-router'
import Cart from './pages/cart/Cart'
import HomePage from './pages/HomePage'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import LoginPage from './pages/account/LoginPage'
import RegisterPage from './pages/account/RegisterPage'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import Loading from './compoments/Loading'
import AddProduct from './pages/AddProduct'
import AuthGuard from './AuthGuard/AuthGuard'
import NotFound from './pages/errors/NotFoundError'
import EditProduct from './pages/EditProduct'
import MainLayout from './layouts/MainLayout'
import GuestGuard from './AuthGuard/GuestGuard'
import { fetchCart } from './pages/cart/cartSlice'
import UserGuard from './AuthGuard/UserGuard'
import CheckOut from './pages/CheckOut/CheckOut'
import OrderPage from './pages/OrderPage'
import { getUser } from './pages/account/accountSlice'
import AccountPage from './compoments/AccountPage'
import { ErrorBoundary } from 'react-error-boundary'

// Error Fallback Component
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Bir şeyler yanlış gitti!</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Tekrar Dene</button>
    </div>
  )
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "home", element: <HomePage /> },
        {
          path: "products",
          children: [
            { index: true, element: <Products /> },
            { path: ":id", element: <ProductDetails /> }
          ]
        },
        {
          element: <GuestGuard />,
          children: [
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> }
          ]
        },
        {
          element: <AuthGuard />,
          children: [
            { path: "add/product", element: <AddProduct /> },
            { path: "edit/product", element: <EditProduct /> }
          ]
        },
        {
          element: <UserGuard />,
          children: [
            { path: "cart", element: <Cart /> },
            { path: "checkout", element: <CheckOut /> },
            { path: "order", element: <OrderPage /> },
            { path: "my-account", element: <AccountPage /> }
          ]
        },
        {
          path: "errors/not-found",
          element: <NotFound />
        },
        {
          path: "errors/server-error",
          element: <div>Sunucu Hatası</div>
        },
        { path: '*', element: <NotFound /> }
      ]
    }
  ],
  {
    future: {
      v7_normalizeFormMethod: true,
      v7_partialHydration: true
    }
  }
)

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = async () => {
    try {
      console.log('🚀 App initialization started');
      await dispatch(getUser());
      await dispatch(fetchCart());
      console.log('✅ App initialization completed');
    } catch (error) {
      console.error('❌ App initialization failed:', error);
    }
  };

  useEffect(() => {
    initApp().finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('React Error Boundary:', error, errorInfo);
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;

// Debug: Window object'e router'ı ekle (sadece development'ta)
if (import.meta.env.DEV) {
  window.__router = router;
  console.log('🔧 Router debug mode enabled. Use window.__router in console.');
}
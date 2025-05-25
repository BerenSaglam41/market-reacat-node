import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Cart from './pages/cart/Cart'
import HomePage from './pages/HomePage'
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
import DebugPage from './pages/DebugPage'
import ApiTestPage from './pages/ApiTestPage'
import Products from './pages/Products'

// Simple Error Fallback Component (react-error-boundary olmadan)
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert" style={{ padding: '20px', textAlign: 'center', border: '1px solid red' }}>
      <h2>Bir şeyler yanlış gitti!</h2>
      <pre style={{ color: 'red', fontSize: '14px' }}>{error?.message}</pre>
      <button onClick={resetErrorBoundary} style={{ marginTop: '10px', padding: '8px 16px' }}>
        Sayfayı Yenile
      </button>
    </div>
  )
}

// Simple Error Boundary Class Component
class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetErrorBoundary={() => {
            this.setState({ hasError: false, error: null });
            window.location.reload();
          }} 
        />
      );
    }

    return this.props.children;
  }
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
          path: "debug",
          element: <DebugPage />
        },
        {
          path: "api-test",
          element: <ApiTestPage />
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
    basename: '/', // Vercel için basename ekle
    future: {
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_fetcherPersist: true,
      v7_relativeSplatPath: true
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
    <SimpleErrorBoundary>
      <RouterProvider router={router} />
    </SimpleErrorBoundary>
  );
}

export default App;

// Debug: Window object'e router'ı ekle (sadece development'ta)
if (import.meta.env.DEV) {
  window.__router = router;
  console.log('🔧 Router debug mode enabled. Use window.__router in console.');
}
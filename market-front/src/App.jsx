import {createBrowserRouter,RouterProvider } from 'react-router'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import LoginPage from './pages/account/LoginPage'
import RegisterPage from './pages/account/RegisterPage'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { getUser } from './pages/account/accountSlice'
import Loading from './compoments/Loading'
import AddProduct from './pages/AddProduct'
import AuthGuard from './AuthGuard/AuthGuard'
export const router = createBrowserRouter(
  [
    {path : '/' , 
      element:<MainLayout/>,
      children : [
        {index : true,element:<HomePage/>},
        {path : "home",element:<HomePage/>},
        {
          path : "products",
          children : [
            {index : true,element:<Products/>},
            {path : ":id",element:<ProductDetails/>}
          ]
        },
        {path : "login" , element:<LoginPage/>},
        {path : "register",element:<RegisterPage/>},
        {element : <AuthGuard/>, children:[
          {path : "add/product",element:<AddProduct/>}
        ]}
      ]
    }
  ]
)

function App(){
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(true);

  const initApp = async () =>{
    await dispatch(getUser())
  }
  useEffect(()=>{
    initApp().then(()=>setLoading(false));
  },[]);
  if(loading) return <Loading/>
  return <RouterProvider router={router}/>
}

export default App
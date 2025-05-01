import React from 'react'
import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { Container } from '@mui/material'
import NavBar from '../compoments/NavBar'
const MainLayout = () => {
  return (
    <>
    <ToastContainer position='bottom-right' hideProgressBar theme='dark' />
    <NavBar/>
    <Container maxWidth="xl" sx={{mt:5}}>
      <Outlet/>
    </Container>
    </>
  )
}

export default MainLayout

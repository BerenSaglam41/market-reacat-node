import React from 'react';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Box, Container } from '@mui/material';
import NavBar from '../compoments/NavBar';
import Footer from '../compoments/Footer';

const MainLayout = () => {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, rgba(173,216,230,1) 50%, rgba(173,216,230,0.1) 50%)`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <ToastContainer position="bottom-right" hideProgressBar theme="dark" />
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 5, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;

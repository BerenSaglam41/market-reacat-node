import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Box, Typography, Paper } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden',
};

const LocationComponent = () => {
  const [location, setLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAu_lrEVb3YnLljMtSlQPmJtB8hKmvxeFk'
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation({
          lat: 40.76572546213826,
          lng: 29.87590180687191
        });
      },
      (err) => {
        console.error("Konum alınamadı", err);
      }
    );
  }, []);

  if (!isLoaded) return <Typography>Harita yükleniyor...</Typography>;

  return (
    <Box
      mt={15}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        sx={{ color: '#333', textAlign: 'center' }}
      >
        Konum Bilgisi
      </Typography>

      <Paper elevation={4} sx={{ p: 3, width: '100%', maxWidth: '800px', borderRadius: 3 }}>
        {location ? (
          <>
            <Typography variant="body1" mb={2} sx={{textAlign:"center"}}>
                Doğan, Hasan Atakan Cd. No:19, 41100 İzmit/Kocaeli            
            </Typography>

            <Box>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={15}
              >
                <Marker position={location} />
              </GoogleMap>
            </Box>
          </>
        ) : (
          <Typography>Konum alınıyor...</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LocationComponent;

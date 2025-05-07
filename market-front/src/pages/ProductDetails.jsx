import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const ProductDetails = ({product,setOpen,open}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: 'blur(5px)' }}
      >
        <DialogTitle>{product.name}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
            <Typography><strong>Fiyat:</strong> {product.price} ₺</Typography>
            <Typography><strong>Açıklama:</strong> {product.description || "Yok"}</Typography>
            <Typography><strong>Kategori:</strong> {product.category || "Belirtilmemiş"}</Typography>
            <Typography><strong>Marka:</strong> {product.brand || "Belirtilmemiş"}</Typography>
            <Typography><strong>Stok:</strong> {product.stock ?? 0}</Typography>
            <Typography><strong>Satış:</strong> {product.soldCount ?? 0}</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductDetails

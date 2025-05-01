import React, { useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, MenuItem
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../productSlice/productSlice';
import { toast } from 'react-toastify';

const EditFormModal = ({ open, onClose, product }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    reset,
    // eslint-disable-next-line no-unused-vars
    watch
  } = useForm();

  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  const onSubmit = async (data) => {
    const changedFields = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== product[key]) {
        changedFields[key] = data[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info("Hiçbir alan değişmedi.");
      return;
    }

    try {
      await dispatch(updateProduct({ id: product._id, data: changedFields })).unwrap();
      toast.success("Ürün başarıyla güncellendi");
      onClose();
    } catch (err) {
      toast.error("Ürün güncellenemedi!");
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ backgroundColor: 'white', p: 3, maxWidth: 400, mx: 'auto', mt: 10 }}>
        <Typography variant="h6" mb={2}>Ürünü Düzenle</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Ad" {...register("name")} sx={{ mb: 2 }} />
          <TextField fullWidth label="Fiyat" type="number" {...register("price")} sx={{ mb: 2 }} />
          <TextField fullWidth label="Açıklama" {...register("description")} sx={{ mb: 2 }} />
          <TextField fullWidth label="Marka" {...register("brand")} sx={{ mb: 2 }} />

          {/* ✅ Kategori alanı Controller ile MUI select uyumlu */}
          <Controller
            name="category"
            control={control}
            rules={{ required: "Kategori zorunludur" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Kategori"
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="drink">Drink</MenuItem>
              </TextField>
            )}
          />

          <TextField fullWidth label="Stok" type="number" {...register("stock")} sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" fullWidth>Kaydet</Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditFormModal;

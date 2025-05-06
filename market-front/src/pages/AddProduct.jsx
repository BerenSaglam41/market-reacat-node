import React from "react";
import {  useSelector } from "react-redux";
import { useForm,Controller } from "react-hook-form";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined, TextFields } from "@mui/icons-material";
import requests from "../api/ApiClient";
import { toast } from "react-toastify";
import { router } from "../App";
import { useDispatch } from 'react-redux'
import { addProductToState } from "../productSlice/productSlice";
 
const AddProduct = () => {
  const dispatch = useDispatch()
  const { status } = useSelector((state) => state.product);
  const {
    register,
    handleSubmit,
    control, 
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      image : "",
      brand: "",
      stock: "",
      category: "", 
    },
    mode: "onChange",
  });
  
  
  async function handleForm(data) {
    try {
      const formData = new FormData();
      for (let key in data) {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      }
      const response = await requests.products.addProduct(formData);
      dispatch(addProductToState(response.product));
      toast.success("Ürün başarıyla Oluşturuldu");
      router.navigate("/products");
    } catch (err) {
      console.log(err.message);
      toast.error("Ürün eklenirken bir hata oluştu");
    }
  }
  
  
  return (
    <div>
      <Container maxWidth="xs">
        <Paper sx={{ padding: 2 }} elevation={3}>
          <Avatar sx={{ mx: "auto", mb: 2, color: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Add Product
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(handleForm)}
            sx={{ mb: 2 }}
          >
            <TextField
              {...register("name", {
                required: "name Zorunlu Alan"
              })}
              type="text"
              label="Enter Name (zorunlu)"
              size="small"
              fullWidth
              autoFocus
              sx={{ mb: 2 }}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register("price", {
                required: "Fiyat zorunlu alandır",
                min: {
                  value: 0.01,
                  message: "Fiyat 0'dan büyük olmalıdır"
                }
              })}
              type="number"
              label="Enter price (zorunlu)"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              {...register("description",)}
              type="text"
              label="Enter description"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <Controller
              name="image"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <input
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  onChange={(e) => field.onChange(e.target.files[0])}
                  style={{ marginBottom: "1rem" }}
                />
              )}
            />
            {errors.image && (
              <p style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.image.message}
              </p>
            )}
            <Controller
              name="category"
              control={control}
              defaultValue="food" // veya "" eğer boş başlatmak istersen
              rules={{ required: "Kategori zorunludur" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Kategori Seçin (zorunlu)"
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  <MenuItem value="">Seçiniz</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="drink">Drink</MenuItem>
                </TextField>
              )}
            />
            <TextField
              {...register("brand", {
                required: "brand Zorunlu Alan",
              })}
              type="text"
              label="Enter brand (zorunlu)"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.brand}
              helperText={errors.brand?.message}
            />
            <TextField
              {...register("stock", {
                required: "stock Alanı zorunlu",
                min: {
                  value: 0.01,
                  message: "Stock 0'dan büyük olmalıdır"
                }
              })}
              type="number"
              label="Enter stock (zorunlu)"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              color="secondary"
            >
              {status === "pending" ? <CircularProgress size={25} /> : "Submit"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default AddProduct;

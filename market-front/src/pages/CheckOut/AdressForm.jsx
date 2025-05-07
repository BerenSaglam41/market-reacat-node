import { Grid, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getAddresses } from "../account/accountSlice";

const AdressForm = () => {
  const dispatch = useDispatch();
  const { register, formState: { errors }, setValue } = useFormContext();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    dispatch(getAddresses()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setAddresses(res.payload);
      }
    });
  }, [dispatch]);

  // Adres seçildiğinde formu güncelleme
  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddress(selectedId);

    // Seçilen adresin verilerini bul
    const selected = addresses.find((address) => address._id === selectedId);

    if (selected) {
      // React Hook Form kullanarak formu güncelle
      setValue("city", selected.city);
      setValue("district", selected.district);
      setValue("phone", selected.phone);
      setValue("address", selected.address); // Burada `address` verisini güncelliyoruz
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Adres Seçimi */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.address}>
          <InputLabel id="address-select-label">Adres Seçin</InputLabel>
          <Select
            labelId="address-select-label"
            {...register("address", { required: "Adres seçmek zorunludur." })}
            value={selectedAddress}
            onChange={handleAddressChange}
            label="Adres Seçin"
            sx={{ mb: 2 }}
          >
            {addresses.map((addr) => (
              <MenuItem key={addr._id} value={addr._id}>
                {addr.address} - {addr.city} / {addr.district}
              </MenuItem>
            ))}
          </Select>
          {errors.address && <FormHelperText>{errors.address.message}</FormHelperText>}
        </FormControl>
      </Grid>

      {/* Adres Detayları */}
      <Grid item xs={12} md={6}>
        <TextField
          {...register("city", { required: "Şehir Zorunlu Alan" })}
          label="Şehir"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.city}
          slotProps={{ inputLabel: { shrink: true } }} // Label'ı yukarıda tutmak için
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          {...register("district", { required: "İlçe Zorunlu Alan" })}
          label="İlçe"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.district}
          slotProps={{ inputLabel: { shrink: true } }} // Label'ı yukarıda tutmak için
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          {...register("phone", { required: "Telefon Zorunlu Alan" })}
          label="Telefon"
          size="small"
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.phone}
          slotProps={{ inputLabel: { shrink: true } }} // Label'ı yukarıda tutmak için
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          {...register("address", { required: "Adres Zorunlu Alan" })}
          label="Adres"
          size="small"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          error={!!errors.address}
          slotProps={{ inputLabel: { shrink: true } }} // Label'ı yukarıda tutmak için
        />
      </Grid>
    </Grid>
  );
};

export default AdressForm;

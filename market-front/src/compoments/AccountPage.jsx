import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
  updateUser,
  getUser
} from "../pages/account/accountSlice";
import { toast } from "react-toastify";

const AccountPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);

  // Adres formu
  const [form, setForm] = useState({
    address: "",
    city: "",
    district: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Kullanıcı bilgisi formu
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    phone: "",
  });

  // Redux user değiştiğinde formu güncelle
  useEffect(() => {
    if (user) {
      setUserForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    dispatch(getAddresses()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setAddresses(res.payload);
      }
    });
  }, [dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUserInputChange = (e) => {
    setUserForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateUser = () => {
    dispatch(updateUser(userForm)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Kullanıcı bilgileri güncellendi!");
        // Redux içindeki user'ı güncellemek için yeniden getUser çağırıyoruz
        dispatch(getUser());
      }
    });
  };

  const handleAddOrUpdateAddress = () => {
    const { address, city, district, phone } = form;
    if (!address || !city || !district || !phone) return;

    if (editingId) {
      dispatch(updateAddress({ addressId: editingId, addressData: form })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Adres güncellendi!");
          setEditingId(null);
          setForm({ address: "", city: "", district: "", phone: "" });
          dispatch(getAddresses()).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              setAddresses(res.payload);
            }
          });
        }
      });
    } else {
      dispatch(addAddress(form)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Adres eklendi!");
          setForm({ address: "", city: "", district: "", phone: "" });
          dispatch(getAddresses()).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
              setAddresses(res.payload);
            }
          });
        }
      });
    }
  };

  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Adres silindi!");
        dispatch(getAddresses()).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            setAddresses(res.payload);
          }
        });
      }
    });
  };

  const handleEditAddress = (addr) => {
    setForm({
      address: addr.address,
      city: addr.city,
      district: addr.district,
      phone: addr.phone,
    });
    setEditingId(addr._id);
  };

  if (!addresses) return <CircularProgress size={25} />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profil Sayfası
      </Typography>

      {/* Kullanıcı Bilgileri Güncelleme */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Kullanıcı Bilgilerini Güncelle</Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Ad Soyad"
              name="username"
              fullWidth
              value={userForm.username}
              onChange={handleUserInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="E-posta"
              name="email"
              fullWidth
              value={userForm.email}
              onChange={handleUserInputChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Telefon"
              name="phone"
              fullWidth
              value={userForm.phone}
              onChange={handleUserInputChange}
            />
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpdateUser}>
          Güncelle
        </Button>
      </Paper>

      {/* Adres Ekleme / Güncelleme */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">{editingId ? "Adresi Güncelle" : "Yeni Adres Ekle"}</Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Adres"
              name="address"
              fullWidth
              value={form.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Şehir"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="İlçe"
              name="district"
              fullWidth
              value={form.district}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Telefon"
              name="phone"
              fullWidth
              value={form.phone}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleAddOrUpdateAddress}
        >
          {editingId ? "Güncelle" : "Adres Ekle"}
        </Button>
      </Paper>

      {/* Adres Listesi */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">Kayıtlı Adresler</Typography>
        <Divider sx={{ my: 2 }} />
        {Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((addr) => (
            <Box
              key={addr._id}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography><strong>Adres:</strong> {addr.address}</Typography>
                <Typography><strong>Şehir:</strong> {addr.city}</Typography>
                <Typography><strong>İlçe:</strong> {addr.district}</Typography>
                <Typography><strong>Telefon:</strong> {addr.phone}</Typography>
              </Box>
              <Box>
                <IconButton onClick={() => handleEditAddress(addr)}>
                  <EditIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteAddress(addr._id)}
                >
                  Sil
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Adres bulunamadı.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AccountPage;

import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "./cartSlice";
import { currenyTRY } from "../../utils/formats";

const Cart = () => {
  const { cart, status } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (!cart || cart.length === 0) {
    return <Alert severity="info">Sepetiniz boş.</Alert>;
  }

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subTotal * 0.2;
  const total = subTotal + tax;

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Fotoğraf</TableCell>
              <TableCell>Ürün</TableCell>
              <TableCell>Marka</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell align="right">Fiyat</TableCell>
              <TableCell align="center">Adet</TableCell>
              <TableCell align="right">Toplam</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    style={{
                      width: "64",
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">
                  {currenyTRY.format(item.price)}
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  {currenyTRY.format(item.price * item.quantity)}
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Button
                      onClick={() => dispatch(addToCart(item.productId))}
                      disabled={status === "loading"}
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.productId,
                            quantity: 1,
                          })
                        )
                      }
                      disabled={status === "loading"}
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <Button
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.productId,
                            quantity: item.quantity,
                          })
                        )
                      }
                      disabled={status === "loading"}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            {/* Ara toplam - vergi - genel toplam */}
            <TableRow>
              <TableCell colSpan={6} />
              <TableCell align="right" colSpan={2}>
                <Box display="flex" justifyContent="space-between">
                  <strong>Ara Toplam:</strong>
                  <span>{currenyTRY.format(subTotal)}</span>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} />
              <TableCell align="right" colSpan={2}>
                <Box display="flex" justifyContent="space-between">
                  <strong>Vergi (%20):</strong>
                  <span>{currenyTRY.format(tax)}</span>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} />
              <TableCell align="right" colSpan={2}>
                <Box display="flex" justifyContent="space-between">
                  <strong>Genel Toplam:</strong>
                  <strong>{currenyTRY.format(total)}</strong>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="secondary" href="/products">
          Alışverişe Devam Et
        </Button>
        <Button variant="contained" color="primary" href="/checkout">
          Ödeme Yap
        </Button>
      </Box>
    </>
  );
};

export default Cart;

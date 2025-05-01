import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseStock,
  fetchProducts,
  increaseStock,
  removeAllStock,
  selectAllProducts,
} from "../productSlice/productSlice";
import Loading from "../compoments/Loading";
import EditFormModal from "../compoments/EditFormModal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";

const EditProduct = () => {
  const dispatch = useDispatch();
  const loadedProducts = useSelector(selectAllProducts);
  const { status, isLoaded, increaseLoadingIds,decreaseLoadingIds,deleteLoadingIds } = useSelector(
    (state) => state.product
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!isLoaded) dispatch(fetchProducts());
  }, [isLoaded, dispatch]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  if (status === "pendingFetchProducts") return <Loading />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Ürün Yönetimi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Resim</TableCell>
              <TableCell>Ad</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Marka</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`}
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price} ₺</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell align="center">
                  <IconButton
                    disabled={increaseLoadingIds.includes(product._id)}
                    color="primary"
                    onClick={() => dispatch(increaseStock(product._id))}
                  >
                    {increaseLoadingIds.includes(product._id) ? <CircularProgress size={20} /> : <AddIcon />}
                  </IconButton>
                  <IconButton
                    color="warning"
                    onClick={() => dispatch(decreaseStock(product._id))}
                    disabled={decreaseLoadingIds.includes(product._id)}
                  >
                    {decreaseLoadingIds.includes(product._id) ? <CircularProgress size={20} /> : <RemoveIcon />}
                    </IconButton>
                  <IconButton
                    color="error"
                    disabled={deleteLoadingIds.includes(product._id)}
                    onClick={() => dispatch(removeAllStock(product._id))}
                  >
                    {deleteLoadingIds.includes(product._id) ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>
                  <IconButton color="info" onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <EditFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={selectedProduct}
      />
    </Box>
  );
};

export default EditProduct;

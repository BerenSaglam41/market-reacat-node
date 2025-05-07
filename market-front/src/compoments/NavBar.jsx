import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../pages/account/accountSlice.js";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useState } from "react";
import Loading from "./Loading.jsx";

const links = [
  { title: "Home", to: "/" },
  { title: "Products", to: "/products" },
];

const authLinks = [
  { title: "Login", to: "/login" },
  { title: "Register", to: "/register" },
];

const NavBar = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.account);
  const { cart } = useSelector((state) => state.cart);
  const itemCount = cart?.reduce((total, item) => total + item.quantity, 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#87CEFA" }}>
      <Toolbar>
        {/* Sol taraf - Logo + Linkler */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <IconButton color="inherit" component={NavLink} to="/">
            <StorefrontIcon />
          </IconButton>
          {links.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              color="inherit"
              sx={{
                "&.active": {
                  color: "white",
                  backgroundColor: "blueviolet",
                },
              }}
            >
              {link.title}
            </Button>
          ))}
        </Box>
        {/* Sağ taraf - Sepet + Kullanıcı */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user ? (
            <>
              <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                size="large"
                edge="start"
              >
                <Badge badgeContent={itemCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Button
                id="user-button"
                onClick={handleClick}
                endIcon={<KeyboardArrowDown />}
                color="inherit"
              >
                {user.username}
              </Button>

              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    if (status !== "pending") {
                      dispatch(logoutThunk()).then(() => {
                        window.location.href = "/login";
                      });
                      handleClose();
                    }
                  }}
                >
                  Çıkış Yap
                </MenuItem>
                <MenuItem component={Link} to="/cart">
                  Sepetim
                </MenuItem>
                <MenuItem component={Link} to="/order">
                  Siparişlerim
                </MenuItem>
                {user.role === "admin"
                  ? [
                      <MenuItem
                        key="add-product"
                        component={Link}
                        to="/add/product"
                      >
                        Ürün Ekle
                      </MenuItem>,
                      <MenuItem
                        key="edit-product"
                        component={Link}
                        to="/edit/product"
                      >
                        Ürün Düzenle/Sil
                      </MenuItem>,
                    ]
                  : null}
              </Menu>
            </>
          ) : (
            authLinks.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                color="inherit"
                sx={{
                  "&.active": {
                    color: "white",
                    backgroundColor: "blueviolet",
                  },
                }}
              >
                {link.title}
              </Button>
            ))
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

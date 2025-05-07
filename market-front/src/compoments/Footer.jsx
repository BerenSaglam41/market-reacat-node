import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <AppBar position="static" sx={{ mt:15,backgroundColor: "#87CEFA" }}>
      <Toolbar>
        <Typography>© 2025 Mustafa Beren Sağlam.</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;

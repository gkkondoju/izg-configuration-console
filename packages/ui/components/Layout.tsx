/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Box from "@mui/material/Box";
import { useState } from "react";
import AppHeader from "../components/AppHeader/index";
import Navigation from "./Navigation";
import { menuItems } from "../components/Navigation/menuItems";
import { useRouter } from "next/router";

const container = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  boxShadow: "inset 0px 0px 25px 10px rgba(0, 0, 0, 0.25)",

};

const content = {
  display: "flex",
  flex: 1,
};

const pageContainer = {
  padding: 3,
  width: "80vw",
  flexGrow: 1,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box sx={container}>
      <Box sx={content}>
        <Navigation items={menuItems} />
        <Box sx={pageContainer}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;

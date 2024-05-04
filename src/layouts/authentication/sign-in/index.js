/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";
import axios from "axios";
import { Navigate, Redirect } from "react-router-dom";

// react-router-dom components
import { Link, redirect } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { jwtDecode } from "jwt-decode";
import MDSnackbar from "components/MDSnackbar";

function Basic() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  // State notification
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("terdapat field yang kosong");
    } else {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          pengguna_username: username,
          password: password,
        });

        // console.log("Response dari API:", response.data.access_token);
        setToken(response.data.access_token);
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("role_id", response.data.role_id);

        // jika bukan admin atau manager maka yang akan dimunculkan hanya informasi mengenai gudang nya saja
        if (response.data.role_id == 1) {
          localStorage.setItem("gudang_id", response.data.gudang_id);
        }
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan:", error);
      }
    }
  };

  if (token) {
    const decode = jwtDecode(token);

    if (decode.role_id != 3) {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/dashboard-admin" />;
    }
  }

  // render Notification

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Notifikasi Error"
      content="Username atau password salah"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <Grid container justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <img
              src={require("../../../assets/images/logos/nyonya-poo.png")}
              style={{ width: "150px", height: "auto" }}
            />
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                value={username}
                onChange={handleUsernameChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <MDBox p={2}>
        <Grid container spacing={6}>
          {renderErrorSB}
        </Grid>
      </MDBox>
    </BasicLayout>
  );
}

export default Basic;

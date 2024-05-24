// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import axios from "axios";
import MDSnackbar from "components/MDSnackbar";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");
  const [errorLength, setErrorLength] = useState("");
  const [isInputInvalid, setIsInputInvalid] = useState(false);
  const [isInputInvalidLength, setIsInputInvalidLength] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  // render Notificartion
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil Merubah Password"
      dateTime="Baru Saja"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Notifikasi Error"
      content="Error saat merubah password"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const handleChangePassword = async () => {
    if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
      if (isInputInvalid == true || isInputInvalidLength == true) {
        alert("Masih terdapat error");
      } else {
        if (setNewPassword == "" || setRetypePassword == "") {
          alert("field harus diisi");
        } else {
          try {
            const response = await axios.post(
              `https://api.tahupoosby.com/api/change-password`,
              {
                password: newPassword,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setNewPassword("");
            setRetypePassword("");
            openSuccessSB();
          } catch (error) {
            openErrorSB();
            console.log("terdapat kesalahan saat melakukan update password");
          }
        }
      }
    }
  };

  const handleChangeRetype = (value) => {
    if (newPassword !== value) {
      setError("Passwords do not match");
      setIsInputInvalid(true);
      return;
    } else {
      setError("");
      setIsInputInvalid(false);
      return;
    }
  };

  const handleChangePasswordInput = (value) => {
    if (value.length >= 8) {
      setIsInputInvalidLength(false);
      setErrorLength("");
    } else {
      setIsInputInvalidLength(true);
      setErrorLength("Minimal character harus 8");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Change Password
                </MDTypography>
              </MDBox>
              <Grid container>
                <Grid item xs={12} pt={4} px={2}>
                  <TextField
                    label="New Password"
                    fullWidth
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      handleChangePasswordInput(e.target.value);
                    }}
                    variant="outlined"
                    margin="normal"
                    error={errorLength !== ""}
                    helperText={errorLength}
                  />
                </Grid>
                <Grid item xs={12} pt={3} px={2}>
                  <TextField
                    label="Re-type New Password"
                    fullWidth
                    type="password"
                    value={retypePassword}
                    onChange={(e) => {
                      setRetypePassword(e.target.value);
                      handleChangeRetype(e.target.value);
                    }}
                    variant="outlined"
                    margin="normal"
                    error={error !== ""}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={12} pt={3} px={2} pb={4}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </MDButton>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={6}>
          {renderSuccessSB}
          {renderErrorSB}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ChangePassword;

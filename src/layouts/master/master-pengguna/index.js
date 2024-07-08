import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Header from "../components/Header";
import {
  Autocomplete,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  Icon,
} from "@mui/material";
import axios from "axios";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenAdmin } from "navigationUtils/navigationUtilsAdmin";

// data
// import dataGudang from "./data/DataGudang";

function MasterPengguna() {
  const [namaPengguna, setNamaPengguna] = useState("");
  const [usernamePengguna, setUsernamePengguna] = useState("");
  const [emailPengguna, setEmailPengguna] = useState("");
  const [passwordPengguna, setPasswordPengguna] = useState("");
  const [confirmpasswordPengguna, setConfirmPasswordPengguna] = useState("");
  const [gudang, setGudang] = useState([]);
  const [gudangIdPick, setGudangIdPick] = useState(null);
  const [gudangId, setGudangId] = useState(null);
  const [role, setRole] = useState([]);
  const [rolePick, setRolePick] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  // const navigate = useNavigate();

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.role_id !== 3) {
      localStorage.removeItem("access_token");
      window.location.href = "/authentication/sign-in";
    }
  }

  // API
  const getAllGudang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/gudang", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setGudang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
    }
  };

  const getAllRole = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/role", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setRole(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
    }
  };

  useEffect(() => {
    getAllGudang();
    getAllRole();
  }, []);

  // useEffect(() => {
  //   navigateAndClearTokenAdmin(navigate);
  // }, [navigate]);

  // End API

  const addBarang = async () => {
    if (window.confirm("Apakah data sudah benar?")) {
      try {
        if (
          namaPengguna == "" ||
          usernamePengguna == "" ||
          passwordPengguna == "" ||
          emailPengguna == "" ||
          rolePick == null ||
          gudangIdPick == null
        ) {
          alert("data tidak boleh kosong");
        } else {
          const datakirim = {
            pengguna_nama: namaPengguna,
            pengguna_username: usernamePengguna,
            password: passwordPengguna,
            password_confirmation: passwordPengguna,
            pengguna_email: emailPengguna,
            role_id: rolePick,
            gudang_id: gudangIdPick,
          };

          console.log(datakirim);
          const add = await axios.post(`http://127.0.0.1:8000/api/pengguna`, datakirim, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          openSuccessSB();
          setNamaPengguna("");
          setUsernamePengguna("");
          setPasswordPengguna("");
          setEmailPengguna("");
          setRolePick(null);
          setGudangIdPick(null);
          setGudangId(null);
          setRoleId(null);
          // setTimeout(() => {
          //   // Refresh halaman
          //   window.location.reload();
          // }, 2000);
        }
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat menambahkan pengguna:", error.response.data.error);
      }
    }
  };

  const handleChangeGudang = (newValue) => {
    if (newValue) {
      setGudangIdPick(newValue.gudang_id);
    } else {
      setGudangIdPick(null);
    }
  };

  const handleChangeRole = (newValue) => {
    if (newValue) {
      setRolePick(newValue.role_id);
    } else {
      setRolePick(null);
    }
  };

  // render Notificartion
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil menambahkan barang"
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
      content="Error saat menambahkan Barang"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  //   const { columns, rows } = dataGudang();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Form Master Pengguna
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            <Grid item xs={6}>
              <MDInput
                label="Nama Pengguna"
                fullWidth
                type="text"
                value={namaPengguna}
                onChange={(e) => {
                  setNamaPengguna(e.target.value);
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              {Array.isArray(gudang) && gudang.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={gudang}
                  value={gudang.find((gud) => gud.gudang_id === gudangId) || null}
                  getOptionLabel={(option) => `${option.gudang_nama || "kosong"}`}
                  onChange={(event, newValue) => {
                    handleChangeGudang(newValue);
                    if (newValue) {
                      setGudangId(newValue.gudang_id);
                    } else {
                      setGudangId(null);
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Karyawan Gudang" />}
                />
              ) : (
                <p>Tidak Ada Gudang</p>
              )}
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Username Pengguna"
                fullWidth
                type="text"
                value={usernamePengguna}
                onChange={(e) => {
                  setUsernamePengguna(e.target.value);
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Email Pengguna"
                fullWidth
                type="text"
                value={emailPengguna}
                onChange={(e) => {
                  setEmailPengguna(e.target.value);
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Password Pengguna"
                fullWidth
                type="password"
                value={passwordPengguna}
                onChange={(e) => {
                  setPasswordPengguna(e.target.value);
                }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              {Array.isArray(role) && role.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={role}
                  value={role.find((r) => r.role_id === roleId) || null}
                  getOptionLabel={(option) => `${option.role_nama}`}
                  onChange={(event, newValue) => {
                    handleChangeRole(newValue);
                    if (newValue) {
                      setRoleId(newValue.role_id);
                    } else {
                      setRoleId(null);
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Pilih Role" />}
                />
              ) : (
                <p>Tidak ada Role</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <MDButton variant="gradient" color="success" fullWidth onClick={addBarang}>
                Add data
              </MDButton>
            </Grid>
          </Grid>
          {/* <MDBox pt={3} pb={4}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox> */}
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            {renderSuccessSB}
            {renderErrorSB}
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default MasterPengguna;

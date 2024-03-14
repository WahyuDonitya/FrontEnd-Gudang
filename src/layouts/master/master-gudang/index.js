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

// data
import dataGudang from "./data/DataGudang";
import { useNavigate } from "react-router-dom";

function MasterGudang() {
  const [gudang_nama, setGudangNama] = useState("");
  const [jenisGudang, setJenisGudang] = useState([]);
  const [jenisGudangPickID, setJenisGudangPickId] = useState(null);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const accessToken = localStorage.getItem("access_token");
  let gudang_id;
  if (accessToken) {
    // Decode token
    const tokenParts = accessToken.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));

    // Ambil nilai gudang_id
    gudang_id = payload.gudang_id;
  }
  // API
  const getAllJenisGudang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/jenisgudang/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setJenisGudang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
    }
  };

  useEffect(() => {
    getAllJenisGudang();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);
  // End API

  const addBarang = async () => {
    if (window.confirm("Apakah data sudah benar?")) {
      try {
        const datakirim = {
          gudang_nama: gudang_nama,
          jenis_gudang_id: parseInt(jenisGudangPickID),
        };
        const add = await axios.post(`http://127.0.0.1:8000/api/gudang`, datakirim, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        openSuccessSB();
        setTimeout(() => {
          // Refresh halaman
          window.location.reload();
        }, 2000);
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat menambahkan gudang:", error);
      }
    }
  };

  const handleChangeJenisGudang = (newValue) => {
    if (newValue) {
      setJenisGudangPickId(newValue.jenis_gudang_id);
    } else {
      setJenisGudangPickId(null);
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

  const { columns, rows } = dataGudang();

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
                label="Nama Gudang"
                fullWidth
                type="text"
                value={gudang_nama}
                onChange={(e) => {
                  setGudangNama(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {Array.isArray(jenisGudang) && jenisGudang.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={jenisGudang}
                  getOptionLabel={(option) => `${option.jenis_gudang_nama}`}
                  onChange={(event, newValue) => {
                    handleChangeJenisGudang(newValue);
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Jenis Gudang " />}
                />
              ) : (
                <p>Loading customer data...</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <MDButton variant="gradient" color="success" fullWidth onClick={addBarang}>
                Add data
              </MDButton>
            </Grid>
          </Grid>
          <MDBox pt={3} pb={4}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
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

export default MasterGudang;

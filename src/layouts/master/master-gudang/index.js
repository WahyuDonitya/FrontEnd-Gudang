import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Header from "../components/Header";
import { Autocomplete, Divider, IconButton, TextField } from "@mui/material";
import axios from "axios";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// data
import dataGudang from "./data/DataGudang";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenAdmin } from "navigationUtils/navigationUtilsAdmin";

function MasterGudang() {
  const [gudang_nama, setGudangNama] = useState("");
  const [gudang, setGudang] = useState([]);
  const [jenisGudang, setJenisGudang] = useState([]);
  const [jenisGudangPickID, setJenisGudangPickId] = useState(null);
  const [gudangEditId, setGudangEditId] = useState(null);
  const [jenisGudangId, setJenisGudangId] = useState(null);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [file, setFile] = useState(null);

  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.role_id !== 3) {
      localStorage.removeItem("access_token");
      window.location.href = "/authentication/sign-in";
    }
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

  const getGudang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/gudang/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setGudang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const handleDelete = async (gudangId) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/gudang/${gudangId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getGudang();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };

  const handleEdit = (gudang_nama, gudang_id) => {
    setGudangNama(gudang_nama);
    setGudangEditId(gudang_id);
  };

  useEffect(() => {
    getAllJenisGudang();
    getGudang();
  }, []);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigateAndClearTokenAdmin(navigate);
  // }, [navigate]);
  // End API

  const addBarang = async () => {
    if (window.confirm("Apakah data sudah benar?")) {
      try {
        if (gudangEditId) {
          const edit = await axios.put(
            `http://127.0.0.1:8000/api/gudang/${gudangEditId}`,
            {
              gudang_nama: gudang_nama,
            },
            { headers: { Authorization: `Bearer  ${accessToken}` } }
          );
          setGudangEditId(null);
        } else {
          if (gudang_nama == "" || jenisGudangPickID == null) {
            alert("Data tidak boleh kosong!");
          } else {
            const datakirim = {
              gudang_nama: gudang_nama,
              jenis_gudang_id: parseInt(jenisGudangPickID),
            };
            const add = await axios.post(`http://127.0.0.1:8000/api/gudang`, datakirim, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          }
        }
        setGudangNama("");
        setJenisGudangId(null);
        setJenisGudangPickId(null);
        openSuccessSB();
        getGudang();
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadExcel = async () => {
    if (window.confirm("Apakah data yang anda masukkan sudah benar")) {
      if (!file) {
        alert("Pilih file Excel terlebih dahulu!");
        return;
      }

      const formData = new FormData();
      formData.append("file_excel", file);

      try {
        // Upload file to backend
        const response = await axios.post(
          "http://127.0.0.1:8000/api/upload-excel/upload-gudang",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("File Excel berhasil diunggah:", response.data);
        getGudang();
        openSuccessSB();

        // Membuat input file baru
        const newFileInput = document.createElement("input");
        newFileInput.type = "file";
        newFileInput.id = "contained-button-file";
        newFileInput.onchange = handleFileChange;

        // Hapus input file yang lama dari DOM
        const oldFileInput = document.getElementById("contained-button-file");
        oldFileInput.parentNode.replaceChild(newFileInput, oldFileInput);
      } catch (error) {
        console.error("Terjadi kesalahan saat mengunggah file Excel:", error);
        openErrorSB();
      }
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

  const columns = [
    { Header: "Nama Gudang", accessor: "gudang_nama", width: "12%", align: "left" },
    { Header: "Jenis Gudang", accessor: "jenis_gudang.jenis_gudang_nama", align: "center" },
    {
      Header: "Delete",
      accessor: "delete",
      width: "12%",
      align: "center",
    },
    {
      Header: "Edit",
      accessor: "edit",
      width: "12%",
      align: "center",
    },
  ];

  const rows = gudang.map((item) => ({
    gudang_nama: item.gudang_nama,
    jenis_gudang: { jenis_gudang_nama: item.jenis_gudang.jenis_gudang_nama },
    delete: (
      <IconButton onClick={() => handleDelete(item.gudang_id)} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    ),
    edit: (
      <IconButton onClick={() => handleEdit(item.gudang_nama, item.gudang_id)} aria-label="delete">
        <EditIcon />
      </IconButton>
    ),
  }));

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
                  value={jenisGudang.find((gudang) => gudang.gudang_id === jenisGudangId) || null}
                  onChange={(event, newValue) => {
                    handleChangeJenisGudang(newValue);
                    if (newValue) {
                      setJenisGudangId(newValue.gudang_id);
                    } else {
                      setJenisGudangId(null);
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Jenis Gudang " />}
                />
              ) : (
                <p>Tidak ada Jenis Gudang</p>
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
              canSearch
            />
          </MDBox>
          <Grid item xs={12}>
            {/* <input type="file" onChange={handleFileChange} /> */}
            <input id="contained-button-file" type="file" onChange={handleFileChange} />
            <MDButton variant="gradient" color="success" onClick={uploadExcel}>
              Upload Excel
            </MDButton>
          </Grid>
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

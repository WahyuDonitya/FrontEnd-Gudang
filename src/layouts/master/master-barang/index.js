import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Header from "../components/Header";
import { Divider, IconButton } from "@mui/material";
import axios from "axios";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";

// data
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenAdmin } from "navigationUtils/navigationUtilsAdmin";

function MasterBarang() {
  const [barang_nama, setNamaBarang] = useState("");
  const [barang, setBarang] = useState([]);
  const [barangIdEdit, setBarangIdEdit] = useState(null);

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

  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigateAndClearTokenAdmin(navigate);
  // }, [navigate]);

  // End API

  const addBarang = async () => {
    if (window.confirm("Apakah data sudah benar?")) {
      try {
        if (barangIdEdit) {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/barang/${barangIdEdit}`,
            {
              barang_nama: barang_nama,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          console.log("Berhasil melakukan update data barang");
          setBarangIdEdit(null);
        } else {
          if (barang_nama == "") {
            alert("Field barang nama kosong");
          } else {
            const add = await axios.post(
              `http://127.0.0.1:8000/api/barang`,
              { barang_nama },
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
          }
        }
        setNamaBarang("");
        openSuccessSB();
        getBarang();
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };

  const getBarang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/barang/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setBarang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const handleDelete = async (barangId) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      if (barangIdEdit != null) {
        alert("Sedang dalam proses edit barang");
      } else {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/barang/${barangId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          getBarang();
        } catch (error) {
          console.error("Terjadi kesalahan saat menghapus barang:", error);
        }
      }
    }
  };

  const handleEdit = (barangId, barang_nama) => {
    setBarangIdEdit(barangId);
    setNamaBarang(barang_nama);
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
          "http://127.0.0.1:8000/api/upload-excel/upload-barang",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("File Excel berhasil diunggah:", response.data);
        getBarang();
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

  useEffect(() => {
    getBarang();
  }, []);

  const columns = [
    { Header: "Barang Id", accessor: "barang_id", width: "12%", align: "left" },
    { Header: "Barang Nama", accessor: "barang_nama", align: "center" },
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

  const rows = barang.map((item) => ({
    barang_id: item.barang_id,
    barang_nama: item.barang_nama,
    delete: (
      <IconButton onClick={() => handleDelete(item.barang_id)} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    ),
    edit: (
      <IconButton onClick={() => handleEdit(item.barang_id, item.barang_nama)} aria-label="delete">
        <EditIcon />
      </IconButton>
    ),
  }));

  // const { columns, rows } = databarang();

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
            Form Master Barang
          </MDTypography>

          <Grid container pt={3} spacing={7}>
            <Grid item xs={12}>
              <MDInput
                label="Nama Barang"
                fullWidth
                type="text"
                value={barang_nama}
                onChange={(e) => {
                  setNamaBarang(e.target.value);
                }}
              />
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

export default MasterBarang;

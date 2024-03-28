import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

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

// data
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenAdmin } from "navigationUtils/navigationUtilsAdmin";

function MasterCustomer() {
  const [customer, setCustomer] = useState([]);
  const [customer_nama, setCustomerNama] = useState("");
  const [customer_telepon, setCustomerTelepon] = useState("");
  const [customer_alamat, setCustomerAlamat] = useState("");
  const [gudangs, setGudangs] = useState([]);
  const [gudangPick, setGudangPick] = useState(null);
  const [gudangValue, setGudangValue] = useState("");
  const [customerIdEdit, setCustomerIdEdit] = useState(null);
  const [file, setFile] = useState(null);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const accessToken = localStorage.getItem("access_token");

  // End API

  const addBarang = async () => {
    if (window.confirm("Apakah data sudah benar?")) {
      try {
        if (customerIdEdit) {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/customer/${customerIdEdit}`,
            {
              customer_nama: customer_nama,
              customer_telepon: customer_telepon,
              customer_alamat: customer_alamat,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setCustomerIdEdit(null);
        } else {
          const add = await axios.post(
            `http://127.0.0.1:8000/api/customer`,
            {
              customer_nama: customer_nama,
              customer_alamat: customer_alamat,
              customer_telepon: customer_telepon,
              gudang_id: gudangPick,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
        }
        setCustomerAlamat("");
        setCustomerNama("");
        setCustomerTelepon("");
        openSuccessSB();
        getCustomer();
        setGudangPick(null);
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };

  const getGudang = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/gudang/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setGudangs(response.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data gudang ".error);
    }
  };

  const getCustomer = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/customer/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setCustomer(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data customer:", error);
    }
  };

  const handleDelete = async (customerID) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/customer/${customerID}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getCustomer();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };

  const handleEdit = (customer_nama, customer_telepon, customer_alamat, customer_id) => {
    setCustomerNama(customer_nama);
    setCustomerTelepon(customer_telepon);
    setCustomerAlamat(customer_alamat);
    setCustomerIdEdit(customer_id);
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
          "http://127.0.0.1:8000/api/upload-excel/upload-customer",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("File Excel berhasil diunggah:", response.data);
        getCustomer();
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

  const columns = [
    { Header: "No. ", accessor: "index", width: "12%", align: "left" },
    { Header: "Customer Nama", accessor: "customer_nama", align: "center" },
    { Header: "Customer Telepon", accessor: "customer_telepon", align: "center" },
    { Header: "Customer Alamat", accessor: "customer_alamat", align: "center" },
    { Header: "Customer Gudang", accessor: "gudang", align: "center" },
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

  const rows = customer.map((item, index) => ({
    index: index + 1,
    customer_nama: item.customer_nama,
    customer_telepon: item.customer_telepon,
    customer_alamat: item.customer_alamat,
    gudang: item.gudang?.gudang_nama,
    delete: (
      <IconButton onClick={() => handleDelete(item.customer_id)} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    ),
    edit: (
      <IconButton
        onClick={() =>
          handleEdit(
            item.customer_nama,
            item.customer_telepon,
            item.customer_alamat,
            item.customer_id
          )
        }
        aria-label="delete"
      >
        <EditIcon />
      </IconButton>
    ),
  }));
  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenAdmin(navigate);
  }, [navigate]);

  useEffect(() => {
    getGudang();
    getCustomer();
  }, []);

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
            <Grid item xs={6}>
              <MDInput
                label="Nama Customer"
                fullWidth
                type="text"
                value={customer_nama}
                onChange={(e) => {
                  setCustomerNama(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Telepon Customer"
                fullWidth
                type="text"
                value={customer_telepon}
                onChange={(e) => {
                  setCustomerTelepon(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Alamat Customer"
                fullWidth
                type="text"
                value={customer_alamat}
                onChange={(e) => {
                  setCustomerAlamat(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {Array.isArray(gudangs) && gudangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={gudangs}
                  getOptionLabel={(option) => `${option.gudang_nama}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setGudangPick(newValue.gudang_id);
                      setGudangValue(newValue.gudang_nama);
                    } else {
                      setGudangPick(null);
                      setGudangValue("");
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Gudang" />}
                />
              ) : (
                <p>Loading gudang data...</p>
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

export default MasterCustomer;

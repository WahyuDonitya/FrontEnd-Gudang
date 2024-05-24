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

import Header from "./components/Header";
import { Autocomplete, Divider, TextField, IconButton, Icon } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import DataTable from "examples/Tables/DataTable";
import MDInput from "components/MDInput";
import { jwtDecode } from "jwt-decode";

function GeneratePermintaanBarang() {
  // State
  const [barangs, setBarangs] = useState([]);

  // ini untuk inputan dynamic table
  const [inputBarangId, setInputBarangId] = useState("");
  const [inputBarangNama, setInputBarangNama] = useState("");
  const [inputKeluarJumlah, setinputKeluarJumlah] = useState("");

  // ini untuk dynamic table
  const [data, setData] = useState([]);
  const [dataToSubmit, setDataToSubmit] = useState([]);

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
    if (decodedToken.role_id != 2) {
      localStorage.removeItem("access_token");
      window.location.href = "/authentication/sign-in";
    }

    if (decodedToken.jenis_gudang == 1) {
      window.location.href = "/list-permintaan-barang";
      return alert("Tidak dapat melakukan akses pada form ini");
    }
  } else {
    window.location.href = "/authentication/sign-in";
  }
  // API

  const getBarang = async () => {
    try {
      const response = await axios.get("https://api.tahupoosby.com/api/barang", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Cetak hasil ke konsol
      // console.log("Data Barang:", response.data);
      setBarangs(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Customer:", error);
    }
  };

  const addBarangKeluar = async () => {
    if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
      if (data.length > 0) {
        const selectedBarang = dataToSubmit.filter(
          (item) => item.dkeluar_jumlah == 0 || Number.isNaN(item.dkeluar_jumlah)
        );
        if (selectedBarang.length > 0) {
          alert("Terdapat data yang kosong pada table");
          return;
        }
        try {
          const dataToSend = {
            detail_transaksi: dataToSubmit,
          };

          const response = await axios.post(
            `https://api.tahupoosby.com/api/permintaan/add-permintaan`,
            dataToSend,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          //   console.log("value data to send: ", dataToSend);
          //   console.log("berhasil input");
          openSuccessSB();
          setData([]);
          setDataToSubmit([]);
        } catch (error) {
          openErrorSB();
          console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
        }
      } else {
        alert("data yang akan dimasukkan kosong");
      }
    }
  };

  // End API

  const handleAdd = () => {
    if (inputBarangNama == "" || inputKeluarJumlah == "") {
      alert("Mohon isi semua field");
    } else {
      const barangId = parseInt(inputBarangId);

      const existingItemIndex = dataToSubmit.findIndex((item) => item.barang_id === barangId);

      if (existingItemIndex !== -1) {
        alert(
          "Barang sudah ditambahkan sebelumnya! Jika ingin melakukan update harap hapus data yang ada pada Table"
        );
        return;
      }

      const newDetailTransaksi = {
        barang_id: barangId,
        dkeluar_jumlah: parseInt(inputKeluarJumlah),
      };
      dataToSubmit.push(newDetailTransaksi);
      console.log(dataToSubmit);

      // ini untuk memunculkan ke dynamic table
      const newData = {
        inputBarangNama,
        inputKeluarJumlah: inputKeluarJumlah.toString(),
      };

      setData([...data, newData]);

      setInputBarangId("");
      setInputBarangNama("");
      setinputKeluarJumlah("");
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    setinputKeluarJumlah(value.toString());
  };

  const handleDelete = (index) => {
    // Salin data dari data dan dataToSubmit
    const updatedData = [...data];
    const updatedDataToSubmit = [...dataToSubmit];

    // Hapus data yang sesuai dari kedua array
    updatedData.splice(index, 1);
    updatedDataToSubmit.splice(index, 1);

    // Atur ulang state data dan dataToSubmit
    setData(updatedData);
    setDataToSubmit(updatedDataToSubmit);
    console.log(dataToSubmit);
  };

  const handleChangeJumlahKeluar = async (index, newValue, stok) => {
    // Salin data dari data dan dataToSubmit
    const updatedData = [...data];
    const updatedDataToSubmit = [...dataToSubmit];

    updatedData[index].inputKeluarJumlah = newValue;
    updatedDataToSubmit[index].dkeluar_jumlah = newValue;

    setData(updatedData);

    console.log(dataToSubmit);
  };

  useEffect(() => {
    getBarang();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  // render notification
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil menambahkan permintaan barang"
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
      content="Error saat menambahkan Permintaan Barang"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang ", accessor: "nama", align: "center" },
    { Header: "Jumlah Barang ", accessor: "jumlah", align: "center" },
    { Header: "Action ", accessor: "action", align: "center" },
  ];

  const rows = data.map((item, index) => {
    return {
      index: index + 1,
      nama: item.inputBarangNama,
      jumlah: (
        <MDInput
          type="number"
          value={item.inputKeluarJumlah || 0}
          onChange={(e) =>
            handleChangeJumlahKeluar(index, parseInt(e.target.value), item.barang_stok)
          }
          inputProps={{ min: 0 }}
        />
      ),
      action: (
        <IconButton aria-label="delete" size="large" onClick={() => handleDelete(index)}>
          <Icon fontSize="small">delete</Icon>
        </IconButton>
      ),
    };
  });

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
            Generate Permintaan Barang
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            <Grid item xs={12}>
              {Array.isArray(barangs) && barangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={barangs.find((barang) => barang.barang_id === inputBarangId) || null}
                  options={barangs}
                  getOptionLabel={(option) => `${option.barang_nama || "Gamuncul"}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setInputBarangId(newValue.barang_id);
                      setInputBarangNama(newValue.barang_nama);
                    } else {
                      setInputBarangId("");
                      setInputBarangNama("");
                    }

                    console.log(barangs);
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Nama Barang" />}
                />
              ) : (
                <p>Data Customer tidak ditemukan...</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Jumlah barang keluar"
                fullWidth
                type="number"
                value={inputKeluarJumlah}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleAdd}>
                Add Row
              </MDButton>
            </Grid>
            <Grid item xs={12}>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDButton variant="gradient" color="success" fullWidth onClick={addBarangKeluar}>
                Add data
              </MDButton>
            </Grid>
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

export default GeneratePermintaanBarang;

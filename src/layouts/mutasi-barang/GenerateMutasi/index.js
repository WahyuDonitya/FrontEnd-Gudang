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
import Footer from "examples/Footer";

import Header from "./components/Header";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format as dateFnsFormat } from "date-fns";
import dayjs from "dayjs";
import MDInput from "components/MDInput";

function GenerateMutasi() {
  const [gudangs, setGudangs] = useState([]);
  const [gudangAwal, setGudangAwal] = useState(null);
  const [gudangTujuan, setGudangTujuan] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [datePicker, setdatePicker] = useState(null);
  const [batch, setBatch] = useState("");
  const [notaSupplier, setNotaSupplier] = useState("");
  const [detailBarang, setDetailBarang] = useState([]);
  const [detailBarangStok, setDetailBarangStok] = useState(null);
  const [detailBarangByBatch, setDetailBarangByBatch] = useState([]);
  const [catatan, setCatatan] = useState("");

  // ini untuk inputan dynamic table
  const [inputBarangId, setInputBarangId] = useState(null);
  const [inputBarangNama, setInputBarangNama] = useState(null);
  const [inputBarangStok, setInputBarangStok] = useState(null);
  const [inputMasukJumlah, setinputMasukJumlah] = useState("");

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

  // ini untuk handlechange input stok
  const [isInputInvalid, setIsInputInvalid] = useState(false);

  const accessToken = localStorage.getItem("access_token");

  // API

  const getGudang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/gudang/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("Data Customer:", response.data);
      setGudangs(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const getSupplier = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/supplier/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("Data Customer:", response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const getBarang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/barang/", {
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

  const addBarangMasuk = async () => {
    try {
      // console.log("nota supplier", notaSupplier);
      const dataKirim = {
        htransfer_barang_tanggal_dikirim: datePicker,
        gudang_id_asal: parseInt(gudangAwal),
        gudang_id_tujuan: parseInt(gudangTujuan),
        htransfer_barang_catatan: catatan,
        detail_transfer: dataToSubmit,
      };

      console.log("hasil data kirim ", dataKirim);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/gudang/transaksi-transfer-barang",
        dataKirim,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      openSuccessSB();
      console.log("berhasil input");
    } catch (error) {
      openErrorSB();
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleChangeBarang = async (barangID) => {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/detailbarang/get-detail-by-barang-id/${barangID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setDetailBarang(response.data);
  };

  const handleSetBatch = async (batchlok) => {
    // console.log("hasil Batch", batchlok);
    // console.log("hasil gudang", gudangAwal);
    // console.log("hasil barang", inputBarangId);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/detailbarang/get-detail-barang-by-batch/${batchlok}/${inputBarangId}/${gudangAwal}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log("Data Detail barang:", response.data.detailbarang_stok);
      setDetailBarangStok(response.data.detailbarang_stok);
      setDetailBarangByBatch(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  // End API

  const handleAdd = () => {
    if (isInputInvalid) {
      alert("Tidak bisa melakukan input row");
    } else {
      const barangId = parseInt(inputBarangId);

      const newBarangMasuk = {
        barang_id: parseInt(barangId),
        dtransfer_barang_jumlah: parseInt(inputMasukJumlah),
        detailbarang_batch: batch,
        detailbarang_id: detailBarangByBatch.detailbarang_id,
      };
      dataToSubmit.push(newBarangMasuk);

      // console.log("hasil dari data to submit : ", dataToSubmit);

      // ini untuk memunculkan ke dynamic table
      const newData = {
        inputBarangNama,
        detailbarang_stok: inputMasukJumlah.toString(),
        detailbarang_batch: batch,
      };

      setData([...data, newData]);

      setInputBarangId(null);
      setInputBarangNama(null);
      setInputBarangStok(null);
      setinputMasukJumlah("");
      setBatch("");
      console.log(dataToSubmit);
    }
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

  const handleCustomerInputChange = (event, newValue) => {
    // Pemisahan string berdasarkan tanda kurung buka dan tutup
    const parts = newValue.split("(");
    if (parts.length > 1) {
      // Mengambil ID yang ada di dalam tanda kurung tutup
      const id = parts[1].replace(")", "");
      setCustomerPick(id);
    }
  };

  const handleStokChange = (newValue) => {
    const numericValue = parseInt(newValue);
    console.log(detailBarangStok);
    if (numericValue > detailBarangStok) {
      setIsInputInvalid(true);
    } else {
      setIsInputInvalid(false);
    }

    if (isInputInvalid == true) {
      setinputMasukJumlah((prev) => {
        prev;
      });
    }
  };

  useEffect(() => {
    getGudang();
    getBarang();
    getSupplier();
  }, []);

  // Untuk tes hasil dari picker
  // useEffect(() => {
  //   console.log("hasil date pick : ", datePicker);
  //   console.log(inputBarangNama);
  // }, [datePicker]);

  // render Notificartion
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil menambahkan barang Masuk"
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
      content="Error saat menambahkan Barang Masuk"
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
            Generate Mutasi Barang
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            {/* Untuk Gudang asal */}
            <Grid item xs={6}>
              {Array.isArray(gudangs) && gudangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={gudangs}
                  getOptionLabel={(option) =>
                    `${option.gudang_nama} (${option.jenis_gudang.jenis_gudang_nama})`
                  }
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Gudang Awal" />}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setGudangAwal(newValue.gudang_id);
                    } else {
                      setGudangAwal(null);
                    }
                  }}
                />
              ) : (
                <p>Loading customer data...</p>
              )}
            </Grid>

            {/* Untuk Gudang Tujuan */}
            <Grid item xs={6}>
              {Array.isArray(gudangs) && gudangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={gudangs}
                  getOptionLabel={(option) =>
                    `${option.gudang_nama} (${option.jenis_gudang.jenis_gudang_nama})`
                  }
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Gudang Tujuan" />}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setGudangTujuan(newValue.gudang_id);
                    } else {
                      setGudangTujuan(null);
                    }
                  }}
                />
              ) : (
                <p>Loading customer data...</p>
              )}
            </Grid>

            {/* Untuk Tanggal kirim Mutasi */}
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  sx={{ width: "100%" }}
                  value={datePicker}
                  onChange={(newValue) => {
                    // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                    const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                    setdatePicker(formattedDate);
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Untuk catatan kirim Mutasi */}
            <Grid item xs={12}>
              <MDInput
                label="Catatan Keluar"
                fullWidth
                type="text"
                value={catatan}
                onChange={(e) => {
                  setCatatan(e.target.value);
                }}
              />
            </Grid>

            {/* Untuk Autocomplete nama barang */}
            <Grid item xs={6}>
              <MDTypography variant="h6" fontWeight="medium">
                List Barang yang Akan dipindah
              </MDTypography>
              <br />
              {Array.isArray(barangs) && barangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={barangs}
                  getOptionLabel={(option) => `${option.barang_nama}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setInputBarangId(newValue.barang_id);
                      setInputBarangNama(newValue.barang_nama);
                      setInputBarangStok(newValue.barang_stok);
                      handleChangeBarang(newValue.barang_id);
                    } else {
                      // Mengosongkan input ketika pilihan dihapus.
                      setInputBarangId(null);
                      setInputBarangNama(null);
                      setInputBarangStok(null);
                      // Anda juga bisa menjalankan tindakan lain di sini jika diperlukan.
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Nama Barang" />}
                />
              ) : (
                <p>Data Customer tidak ditemukan...</p>
              )}
            </Grid>

            {/* Untuk Autocomplete Nomor batch barang */}
            <Grid item xs={6}>
              <br />
              <br />
              {Array.isArray(detailBarang) && detailBarang.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={detailBarang}
                  getOptionLabel={(option) => `${option.detailbarang_batch}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setBatch(newValue.detailbarang_batch);
                      handleSetBatch(newValue.detailbarang_batch);
                    } else {
                      setDetailBarangStok(null);
                      setBatch("");
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Batch Barang" />}
                />
              ) : (
                <p>Data Batch tidak ditemukan...</p>
              )}
            </Grid>

            {/* untuk Jumlah barang yang akan dimutasi */}
            <Grid item xs={12}>
              <MDInput
                label="Jumlah barang mutasi"
                fullWidth
                type="number"
                value={inputMasukJumlah}
                onChange={(e) => {
                  handleStokChange(e.target.value);
                  setinputMasukJumlah(e.target.value);
                }}
                error={isInputInvalid}
                helperText={isInputInvalid ? "Jumlah melebihi stok yang tersedia" : ""}
                sx={{
                  "& .MuiInput-root": { borderColor: isInputInvalid ? "red" : "" },
                }}
              />
            </Grid>

            {/* Button Add */}
            <Grid item xs={12}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleAdd}>
                Add Row
              </MDButton>
            </Grid>

            {/* Untuk data table */}
            <Grid item xs={12}>
              {data.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {data.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.inputBarangNama}</TableCell>
                          <TableCell>{item.detailbarang_stok}</TableCell>
                          <TableCell>{item.detailbarang_batch}</TableCell>
                          <TableCell>{item.detailbarang_expdate}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              size="large"
                              onClick={() => handleDelete(index)}
                            >
                              <Icon fontSize="small">delete</Icon>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <p>No data available</p>
              )}
            </Grid>

            {/* Untuk Add data ke DB */}
            <Grid item xs={12}>
              <MDButton variant="gradient" color="success" fullWidth onClick={addBarangMasuk}>
                Add data
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>

        {/* Untuk Snackbar */}
        <MDBox p={2}>
          <Grid container spacing={6}>
            {renderSuccessSB}
            {renderErrorSB}
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default GenerateMutasi;

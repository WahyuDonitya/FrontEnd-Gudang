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
import { useNavigate } from "react-router-dom";

function BarangKeluar() {
  // State
  const [customer, setCustomer] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [gudangs, setGudangs] = useState([]);
  const [customerPick, setCustomerPick] = useState("");
  const [gudangPick, setGudangPick] = useState(null);
  const [datePicker, setdatePicker] = useState(null);

  // ini untuk inputan dynamic table
  const [inputBarangId, setInputBarangId] = useState("");
  const [inputBarangNama, setInputBarangNama] = useState("");
  const [inputBarangStok, setInputBarangStok] = useState("");
  const [inputKeluarJumlah, setinputKeluarJumlah] = useState("");
  const [hargakeluar, setHargaKeluar] = useState("");

  // ini untuk dynamic table
  const [data, setData] = useState([]);
  const [dataToSubmit, setDataToSubmit] = useState([]);

  // ini untuk handlechange input stok
  const [isInputInvalid, setIsInputInvalid] = useState(false);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const accessToken = localStorage.getItem("access_token");

  // API

  const getGudang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/gudang/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setGudangs(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Customer:", error);
    }
  };

  const getCustomer = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get-customer-by-gudang", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("Data Customer:", response.data);
      setCustomer(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Customer:", error);
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

  const addBarangKeluar = async () => {
    if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
      try {
        const customerId = parseInt(customerPick);

        const dataToSend = {
          gudang_id: gudangPick,
          customer_id: customerId,
          hkeluar_tanggal: datePicker,
          detail_transaksi: dataToSubmit,
        };

        console.log("value data to send: ", dataToSend);

        const response = await axios.post(
          "http://127.0.0.1:8000/api/transaksi-barang-keluar",
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("berhasil input");
        openSuccessSB();
        setData([]);
        setDataToSubmit([]);
        setdatePicker(null);
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
      }
    }
  };

  // End API

  const handleAdd = () => {
    const barangId = parseInt(inputBarangId);

    const newDetailTransaksi = {
      barang_id: barangId,
      dkeluar_jumlah: parseInt(inputKeluarJumlah),
      dkeluar_harga: parseFloat(hargakeluar),
    };
    dataToSubmit.push(newDetailTransaksi);

    // ini untuk memunculkan ke dynamic table
    const newData = {
      inputBarangNama,
      inputKeluarJumlah: inputKeluarJumlah.toString(),
      hargakeluar: hargakeluar.toString(),
    };

    setData([...data, newData]);

    setInputBarangId("");
    setInputBarangNama("");
    setInputBarangStok("");
    setinputKeluarJumlah("");
    setHargaKeluar("");
    // console.log(dataToSubmit);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > inputBarangStok) {
      alert(`Barang yang anda pilih hanya memiliki stok : ${inputBarangStok}`);
      setIsInputInvalid(true);
    } else {
      setIsInputInvalid(false);
      setinputKeluarJumlah(value.toString());
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

  const handleInputChangeBarang = async (barangId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/detailbarang/get-detail-barang-stok-by-gudang/${barangId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data[0].total_stok);
      if (response.data.length > 0) {
        setInputBarangStok(response.data[0].total_stok);
      } else {
        alert("Barang yang anda pilih stok nya kosong.");
      }
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil stok barang : ", error);
    }
  };

  useEffect(() => {
    getCustomer();
    getBarang();
    getGudang();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

  // Untuk tes hasil dari picker
  // useEffect(() => {
  //   console.log("hasil date pick : ", datePicker);
  //   console.log(inputBarangNama);
  // }, [datePicker]);

  // render notification
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil menambahkan barang keluar"
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
      content="Error saat menambahkan Barang Keluar"
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
            Barang Keluar Form
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            {/* Customer */}
            <Grid item xs={6}>
              {Array.isArray(customer) && customer.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={customer}
                  getOptionLabel={(option) => `${option.customer_nama} (${option.customer_id})`}
                  onInputChange={handleCustomerInputChange}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Customer" />}
                />
              ) : (
                <p>Loading customer data...</p>
              )}
            </Grid>

            {/* TAnggal keluar */}
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={datePicker}
                  sx={{ width: "100%" }}
                  fullWidth
                  onChange={(newValue) => {
                    // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                    const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                    setdatePicker(formattedDate);
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Gudang */}
            {/* <Grid item xs={12}>
              {!localStorage.getItem("gudang_id") ? (
                Array.isArray(gudangs) && gudangs.length > 0 ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={gudangs}
                    getOptionLabel={(option) => `${option.gudang_nama}`}
                    onChange={(event, newValue) => {
                      setGudangPick(newValue.gudang_id);
                      console.log(localStorage.getItem("gudang_id"));
                    }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Gudang" />}
                  />
                ) : (
                  <p>Loading gudang data...</p>
                )
              ) : null}
            </Grid> */}

            {/* Barang */}
            <Grid item xs={12}>
              {Array.isArray(barangs) && barangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  // value={inputBarang}
                  options={barangs}
                  getOptionLabel={(option) => `${option.barang_nama}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setInputBarangId(newValue.barang_id);
                      setInputBarangNama(newValue.barang_nama);
                      handleInputChangeBarang(newValue.barang_id);
                      // setInputBarangStok(newValue.barang_stok);
                    } else {
                      setInputBarangId(null);
                      setInputBarangNama(null);
                      setInputBarangStok(null);
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

            {/* Jumlah barang keluar */}
            <Grid item xs={12}>
              <TextField
                label="Jumlah barang keluar"
                fullWidth
                type="number"
                value={inputKeluarJumlah}
                onChange={handleInputChange}
                error={isInputInvalid}
                helperText={isInputInvalid ? "Jumlah melebihi stok yang tersedia" : ""}
                sx={{ "& .MuiInput-root": { borderColor: isInputInvalid ? "red" : "" } }}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Harga */}
            <Grid item xs={12}>
              <TextField
                label="Harga Barang Keluar (Tidak Wajib)"
                fullWidth
                value={hargakeluar}
                onChange={(e) => setHargaKeluar(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleAdd}>
                Add Row
              </MDButton>
            </Grid>
            <Grid item xs={12}>
              {data.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {data.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.inputBarangNama}</TableCell>
                          <TableCell>{item.inputKeluarJumlah}</TableCell>
                          <TableCell>{item.hargakeluar}</TableCell>
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

export default BarangKeluar;

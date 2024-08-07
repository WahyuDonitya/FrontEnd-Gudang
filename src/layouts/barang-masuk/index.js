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
import { Autocomplete, Divider, TextField, IconButton, Icon } from "@mui/material";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format as dateFnsFormat } from "date-fns";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import DataTable from "examples/Tables/DataTable";
import MDInput from "components/MDInput";

function BarangMasuk() {
  const [gudangs, setGudangs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [gudangPick, setGudangPick] = useState(null);
  const [supplierPick, setSupplierPick] = useState(null);
  const [datePicker, setdatePicker] = useState(null);
  const [datePicker2, setdatePicker2] = useState(null);
  const [batch, setBatch] = useState("");
  const [batchProduksi, setBatchProduksi] = useState("");
  const [notaSupplier, setNotaSupplier] = useState("");
  const [barangRusak, setBarangRusak] = useState(0);
  const [selectedBarang, setSelectedBarang] = useState(null);

  // ini untuk inputan dynamic table
  const [inputBarangId, setInputBarangId] = useState(null);
  const [inputBarangNama, setInputBarangNama] = useState(null);
  const [inputBarangStok, setInputBarangStok] = useState(null);
  const [inputMasukJumlah, setinputMasukJumlah] = useState("");
  const [hargakeluar, setHargaKeluar] = useState("");

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
  let gudang_id;
  if (accessToken) {
    // Decode token
    const tokenParts = accessToken.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));

    // Ambil nilai gudang_id
    gudang_id = payload.gudang_id;
  }

  // API

  const getSupplier = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/supplier", {
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
      const response = await axios.get("http://127.0.0.1:8000/api/barang", {
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
    if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
      if (notaSupplier != "" && data.length > 0) {
        const selectedBarang = dataToSubmit.filter(
          (item) => item.detailbarang_stok == 0 || Number.isNaN(item.detailbarang_stok)
        );
        if (selectedBarang.length > 0) {
          alert("Terdapat data yang kosong pada table");
          return;
        }

        try {
          // console.log("nota supplier", notaSupplier);
          const dataKirim = {
            hmasuk_notasupplier: notaSupplier,
            supplier_id: parseInt(supplierPick),
            barang_masuk: dataToSubmit,
          };

          const response = await axios.post(
            "http://127.0.0.1:8000/api/detailbarang/add",
            dataKirim,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          openSuccessSB();
          console.log("berhasil input");
          setData([]);
          setDataToSubmit([]);
          setNotaSupplier("");
        } catch (error) {
          openErrorSB();
          console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
        }
      } else {
        alert("input nota supplier atau tidak ada data yang diinput");
      }
    }
  };

  // End API

  const handleAdd = () => {
    if (
      isInputInvalid == false &&
      inputBarangNama != null &&
      inputMasukJumlah != null &&
      datePicker != null &&
      datePicker2 != null
    ) {
      const barangId = parseInt(inputBarangId);

      const newBarangMasuk = {
        gudang_id: parseInt(gudang_id),
        barang_id: parseInt(barangId),
        detailbarang_stok: parseInt(inputMasukJumlah),
        detailbarang_batch: batch,
        detailbarang_expdate: datePicker,
        detailbarang_jumlahrusakmasuk: barangRusak,
        detailbarang_batchproduksi: datePicker2,
      };
      dataToSubmit.push(newBarangMasuk);

      // ini untuk memunculkan ke dynamic table
      const newData = {
        inputBarangNama,
        detailbarang_stok: inputMasukJumlah.toString(),
        detailbarang_batch: batch,
        detailbarang_expdate: datePicker,
        detailbarang_batchproduksi: datePicker2,
        jumlahrusak: barangRusak.toString(),
      };

      setData([...data, newData]);

      setInputBarangId(null);
      setInputBarangNama(null);
      setInputBarangStok(null);
      setBarangRusak(0);
      setinputMasukJumlah("");
      setBatch("");
      setdatePicker(null);
      setdatePicker2(null);
      console.log(dataToSubmit);
    } else {
      alert("Gagal menambahkan barang karna masih ada error");
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

  const handleChangeJumlahMasuk = (index, newJumlah) => {
    // Salin data dari data dan dataToSubmit
    const updatedData = [...data];
    const updatedDataToSubmit = [...dataToSubmit];

    updatedData[index].detailbarang_stok = newJumlah;
    updatedDataToSubmit[index].detailbarang_stok = newJumlah;

    // console.log(dataToSubmit);

    setData(updatedData);
  };

  const handleChangeJumlahRusak = (index, newJumlah) => {
    const updatedData = [...data];
    const updatedDataToSubmit = [...dataToSubmit];

    if (updatedData[index].detailbarang_stok <= newJumlah) {
      alert("Tidak Boleh melebihi stok saat ini");
    } else {
      updatedData[index].jumlahrusak = newJumlah;
      updatedDataToSubmit[index].detailbarang_jumlahrusakmasuk = newJumlah;
      setData(updatedData);
    }

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

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= inputMasukJumlah) {
      alert(`Barang yang anda pilih hanya memiliki stok : ${inputMasukJumlah}`);
      setIsInputInvalid(true);
    } else {
      setIsInputInvalid(false);
      setBarangRusak(value);
    }
  };

  useEffect(() => {
    // getGudang();
    getBarang();
    getSupplier();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang", accessor: "barang", align: "center" },
    { Header: "Jumlah barang masuk", accessor: "jumlahmasuk", align: "center" },
    { Header: "Batch Barang", accessor: "batch", align: "center" },
    { Header: "Barang Exp Date", accessor: "exp", align: "center" },
    { Header: "Barang Production Date", accessor: "prod", align: "center" },
    { Header: "Jumlah Barang Rusak", accessor: "jumlahrusak", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = data.map((item, index) => {
    return {
      index: index + 1,
      barang: item.inputBarangNama,
      // jumlahmasuk: item.detailbarang_stok,
      batch: item.detailbarang_batch,
      exp: item.detailbarang_expdate,
      prod: item.detailbarang_batchproduksi,
      jumlahrusak: (
        <MDInput
          type="number"
          value={item.jumlahrusak || 0}
          onChange={(e) => handleChangeJumlahRusak(index, parseInt(e.target.value))}
          inputProps={{ min: 0 }}
        />
      ),
      jumlahmasuk: (
        <MDInput
          type="number"
          value={item.detailbarang_stok || 0}
          onChange={(e) => handleChangeJumlahMasuk(index, parseInt(e.target.value))}
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
            Barang Masuk Form
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            {/* <Grid item xs={6}>
              {Array.isArray(gudangs) && gudangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={gudangs}
                  getOptionLabel={(option) =>
                    `${option.gudang_nama} (${option.jenis_gudang.jenis_gudang_nama})`
                  }
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Gudang" />}
                  onChange={(event, newValue) => {
                    // console.log(newValue.gudang_id);
                    setGudangPick(newValue.gudang_id);
                  }}
                />
              ) : (
                <p>Loading customer data...</p>
              )}
            </Grid> */}
            {/* <Grid item xs={12}>
              {gudang_id === 1 &&
                (Array.isArray(suppliers) && suppliers.length > 0 ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={suppliers}
                    getOptionLabel={(option) => option.supplier_name}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSupplierPick(newValue.supplier_id);
                      } else {
                        setSupplierPick(null);
                      }
                    }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Supplier" />}
                  />
                ) : (
                  <p>Loading customer data...</p>
                ))}
            </Grid> */}

            <Grid item xs={12}>
              <TextField
                label="Nota Kediri"
                fullWidth
                value={notaSupplier}
                onChange={(e) => setNotaSupplier(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium">
                List Barang Masuk
              </MDTypography>
            </Grid>
            <Grid item xs={6}>
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
                      setInputBarangStok(newValue.barang_stok);
                    } else {
                      setInputBarangId(null);
                      setInputBarangNama(null);
                      setInputBarangStok(null);
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Nama Barang" />}
                />
              ) : (
                <p>Data Customer tidak ditemukan...</p>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Jumlah barang masuk"
                fullWidth
                type="number"
                value={inputMasukJumlah}
                onChange={(e) => setinputMasukJumlah(e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="h6" fontWeight="small">
                Batch Produksi
              </MDTypography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  sx={{ width: "100%" }}
                  value={datePicker2}
                  onChange={(newValue) => {
                    // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                    const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                    setdatePicker2(formattedDate);
                    const formattedDate2 = newValue ? dayjs(newValue).format("DDMMYYYY") : "";
                    setBatchProduksi(formattedDate2);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <MDTypography variant="h6" fontWeight="small">
                Exp Date
              </MDTypography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  fullWidth
                  disablePast
                  sx={{ width: "100%" }}
                  value={datePicker}
                  onChange={(newValue) => {
                    // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                    const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                    setdatePicker(formattedDate);
                    const formattedDate2 = newValue ? dayjs(newValue).format("DDMMYYYY") : "";
                    setBatch(formattedDate2);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Jumlah barang Rusak"
                fullWidth
                type="number"
                value={barangRusak}
                onChange={handleInputChange}
                error={isInputInvalid}
                helperText={isInputInvalid ? "Jumlah melebihi stok yang masuk" : ""}
                sx={{ "& .MuiInput-root": { borderColor: isInputInvalid ? "red" : "" } }}
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
              <MDButton variant="gradient" color="success" fullWidth onClick={addBarangMasuk}>
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

export default BarangMasuk;

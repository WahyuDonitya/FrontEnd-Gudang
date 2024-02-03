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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format as dateFnsFormat } from "date-fns";
import dayjs from "dayjs";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";

function GeneratePackaging() {
  const [hmasuk, setHmasuk] = useState([]);
  const [selectedHmasuk, setSelectedHMasuk] = useState(null);
  const [detailBarang, setDetailBarang] = useState([]);
  const [detailBarangId, setDetailBarangId] = useState(null);
  const [detailBarangExp, setDetailBarangExp] = useState(null);
  const [detailBarangBatch, setDetailBarangBatch] = useState(null);
  const [stokBarang, setStokBarang] = useState(0);
  const [jumlahRusak, setJumlahRusak] = useState(null);

  // ini untuk inputan dynamic table
  const [inputBarangId, setInputBarangId] = useState(null);
  const [inputBarangNama, setInputBarangNama] = useState(null);
  const [inputJumlahPacking, setInputJumlahPacking] = useState("");

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
  const [isInputRusakInvalid, setIsInputRusakInvalid] = useState(false);

  const accessToken = localStorage.getItem("access_token");

  // API
  const getHmasuk = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/detailbarang/get-hbarang-masuk-approved`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setHmasuk(response.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data Header Masuk : ", error);
    }
  };

  const handleChange = async (newValue) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/detailbarang/get-dbarang-only-tahu-polos/${newValue.hmasuk_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDetailBarang(response.data);
      setDetailBarangId(response.data[0].detailbarang_id);
      setDetailBarangBatch(response.data[0].detailbarang_batch);
      setDetailBarangExp(response.data[0].detailbarang_expdate);
      // console.log(response.data);
      setStokBarang(response.data[0].detailbarang_stok);
    } catch (error) {
      console.log("Terjadi kesalah saat mengambil data barang masuk ", error);
    }
  };

  const handleAdd = async () => {
    if (isInputRusakInvalid) {
      alert("Barang Yang anda kelebihan");
    } else {
      if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
        try {
          const datatosend = {
            hmasuk_nota: selectedHmasuk,
            detailbarang_id: detailBarangId,
            jumlah_packing: parseInt(inputJumlahPacking),
            jumlah_rusak: parseInt(jumlahRusak),
          };
          console.log(datatosend);

          const response = await axios.post(
            "http://127.0.0.1:8000/api/packaging/add-packaging",
            datatosend,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setDetailBarang([]);
          setSelectedHMasuk(null);
          setStokBarang(0);
          openSuccessSB();
          closeRusakModalHandler();
        } catch (error) {
          openErrorSB();
          console.log("Terjadi Kesalahan saat menambahkan data packaging : ", error);
        }
      }
    }
  };

  // End API

  useEffect(() => {
    getHmasuk();
  }, []);

  // Untuk tes hasil dari picker
  // useEffect(() => {
  //   console.log("hasil date pick : ", datePicker);
  //   console.log(inputBarangNama);
  // }, [datePicker]);

  //  Function
  const handleChangeJumlah = (value) => {
    const numericValue = parseInt(value);
    if (numericValue > stokBarang) {
      alert(`Barang yang dapat dipacking hanya : ${stokBarang}`);
      setIsInputInvalid(true);
    } else {
      setIsInputInvalid(false);
      setInputJumlahPacking(numericValue);
    }
  };

  const handleChangeRusak = (value) => {
    const numericValue = parseInt(value);

    if (numericValue > inputJumlahPacking) {
      alert("Angka yang anda masukkan melebihi jumlah yang ingin di packing");
      setIsInputRusakInvalid(true);
    } else {
      setIsInputRusakInvalid(false);
      setJumlahRusak(numericValue);
    }
  };
  //  End Function

  // Handle modal
  const [openRusakModal, setOpenRusakModal] = useState(false);

  const openRusakModalHandler = () => {
    if (isInputInvalid) {
      alert("Tidak boleh melebihi stok barang");
    } else {
      if (!selectedHmasuk) {
        alert("Harus memilih Nota barang masuk terlebih dahulu");
      } else {
        setOpenRusakModal(true);
      }
    }
  };

  const closeRusakModalHandler = () => {
    setOpenRusakModal(false);
    setJumlahRusak(0); // Clear reject reason when modal is closed
  };
  // End Handle modal

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

  //   data untuk datatables
  const columns = [
    { Header: "Nama Barang", accessor: "barang.barang_nama", width: "10%", align: "left" },
    { Header: "Jumlah Barang yang Bisa dipack", accessor: "detailbarang_stok", align: "center" },
    { Header: "Expired Date", accessor: "detailbarang_expdate", align: "center" },
    { Header: "Jumlah Packing", accessor: "jumlah_kirim", align: "center" },
    // { Header: "Jumlah Rusak Saat Packing", accessor: "jumlah_rusak", align: "center" },
  ];

  const rows = detailBarang.map((item) => ({
    barang: { barang_nama: item.barang.barang_nama },
    detailbarang_stok: item.detailbarang_stok,
    detailbarang_expdate: item.detailbarang_expdate,
    jumlah_kirim: (
      <MDInput
        type="number"
        inputProps={{ min: 0 }}
        value={inputJumlahPacking}
        onChange={(e) => {
          //   setInputJumlahPacking(e.target.value);
          handleChangeJumlah(e.target.value);
        }}
        error={isInputInvalid}
        helperText={isInputInvalid ? "Jumlah melebihi stok yang tersedia" : ""}
        sx={{
          "& .MuiInput-root": { borderColor: isInputInvalid ? "red" : "" },
        }}
      />
    ),
    // jumlah_rusak: (
    //   <MDInput
    //     type="number"
    //     inputProps={{ min: 0 }}
    //     value={inputJumlahPacking}
    //     onChange={(e) => {
    //       //   setInputJumlahPacking(e.target.value);
    //       handleChangeJumlah(e.target.value);
    //     }}
    //     error={isInputInvalid}
    //     helperText={isInputInvalid ? "Jumlah melebihi stok yang tersedia" : ""}
    //     sx={{
    //       "& .MuiInput-root": { borderColor: isInputInvalid ? "red" : "" },
    //     }}
    //   />
    // ),
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
            Proses Packaging Barang
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            {/* Untuk Hmasuk */}
            <Grid item xs={12}>
              {Array.isArray(hmasuk) && hmasuk.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={hmasuk}
                  getOptionLabel={(option) => `${option.hmasuk_nota}`}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="Pilih Nota Masuk Barang" />
                  )}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSelectedHMasuk(newValue.hmasuk_nota);
                      handleChange(newValue);
                    } else {
                      setSelectedHMasuk(null);
                      setDetailBarang([]);
                    }
                  }}
                />
              ) : (
                <p>Loading customer data...</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={true}
                showTotalEntries={false}
                noEndBorder
              />
            </Grid>

            <Grid item xs={12}>
              <MDButton
                variant="gradient"
                color="success"
                fullWidth
                onClick={openRusakModalHandler}
              >
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
      <Dialog open={openRusakModal} onClose={closeRusakModalHandler}>
        <DialogTitle>Input Jumlah barang Rusak</DialogTitle>
        <DialogContent>
          <MDInput
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
            rows={4}
            variant="outlined"
            label="Jumlah barang yang rusak"
            value={jumlahRusak}
            onChange={(e) => {
              handleChangeRusak(e.target.value);
            }}
            error={isInputRusakInvalid}
            helperText={isInputRusakInvalid ? "Jumlah melebihi stok yang tersedia" : ""}
            sx={{
              "& .MuiInput-root": { borderColor: isInputRusakInvalid ? "red" : "" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <MDButton color="error" onClick={closeRusakModalHandler}>
            Cancel
          </MDButton>
          <MDButton color="success" onClick={handleAdd}>
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default GeneratePackaging;

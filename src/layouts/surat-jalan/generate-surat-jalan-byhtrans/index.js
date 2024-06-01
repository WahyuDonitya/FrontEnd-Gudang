// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import { jwtDecode } from "jwt-decode";

// import projectsTableData from "layouts/tables/data/projectsTableData";

function GenerateSuratJalanByHtrans() {
  // State
  const { dataId } = useParams();
  const [htransfer, setHtransfer] = useState([]);
  const [selectedHtransfer, setSelectedHtransfer] = useState(null);
  const [listBarangTransfer, setListBarangTransfer] = useState([]);
  const [selectedTransferNota, setSelectedTransferNota] = useState(null);
  const [jumlahKirimTransByItem, setJumlahKirimTransByItem] = useState({});
  const [datePickerTransfer, setDatePickerTransfer] = useState(null);
  const [idHtransfer, setIdHtransfer] = useState(null);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const [isInputInvalid, setIsInputInvalid] = useState({});

  // end state

  const accessToken = localStorage.getItem("access_token");
  let decode;
  if (accessToken) {
    decode = jwtDecode(accessToken);
  }

  // API

  const getHtransfer = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/suratjalan/get-htransfer-approved",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setHtransfer(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data HKeluar:", error);
    }
  };

  const handleChangeHtransfer = async (newValue) => {
    if (newValue) {
      setSelectedHtransfer(newValue);
      setSelectedTransferNota(newValue);
      console.log(newValue.htransfer_barang_id);
      try {
        const response = await axios.get(
          `https://api.tahupoosby.com/api/suratjalan/get-dtransfer-approved/${newValue.htransfer_barang_id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setListBarangTransfer(response.data);
        console.log("List barang transfer ", listBarangTransfer);
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data List barang:", error);
      }
    } else {
      setSelectedHtransfer(null);
      setListBarangTransfer([]);
      setSelectedTransferNota(null);
    }
  };

  // End API

  useEffect(() => {
    getHtransfer();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  // Function

  const addSuratJalantransfer = async () => {
    if (window.confirm("Apakah data yang dibuat sudah benar?")) {
      try {
        if (!selectedTransferNota || !datePickerTransfer) {
          alert("Pastikan nomor nota dan tanggal telah ditentukan");
          return;
        }

        const selectedBarang = listBarangTransfer
          .filter((item) => jumlahKirimTransByItem[item.dtransfer_barang_id] > 0)
          .map((item) => ({
            dtransfer_barang_id: item.dtransfer_barang_id,
            barang_nama: item.barang.barang_nama,
            detailbarang_batch: item.barang_detail.detailbarang_batch,
            dtransfer_barang_jumlah: item.dtransfer_barang_jumlah,
            jumlah_kirim: jumlahKirimTransByItem[item.dtransfer_barang_id],
          }));

        // setDetailSuratJalan(selectedBarang);
        const dataToSend = {
          suratjalantransfer_tanggalkirim: datePickerTransfer,
          htransfer_barang_id: selectedHtransfer.htransfer_barang_id,
          detail_suratjalantransfer: selectedBarang,
        };

        const response = await axios.post(
          "https://api.tahupoosby.com/api/suratjalan/generate-transfer-surat-jalan",
          dataToSend,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // console.log("data to send: ", dataToSend);
        openSuccessSB();
        setSelectedHtransfer(null);
        setListBarangTransfer([]);
        setJumlahKirimTransByItem({});
        setDatePickerTransfer(null);
        setIdHtransfer(null);
        getHtransfer();
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat menambahkan data Surat Jalan:", error);
      }
    }
  };

  const handleChangeJumlahKirimTransfer = (itemId, newValue) => {
    const currentItem = listBarangTransfer.find((item) => item.dtransfer_barang_id === itemId);

    // Create a copy of the existing isInputInvalid state
    const updatedIsInputInvalid = { ...isInputInvalid };

    // Update the validity for the current item
    if (newValue > currentItem.dtransfer_barang_jumlah_belum_terkirim) {
      updatedIsInputInvalid[itemId] = true;
    } else {
      updatedIsInputInvalid[itemId] = false;
    }

    setIsInputInvalid(updatedIsInputInvalid);

    if (!updatedIsInputInvalid[itemId]) {
      setJumlahKirimTransByItem((prev) => ({
        ...prev,
        [itemId]: parseInt(newValue),
      }));
    }
  };

  const columnstransfer = [
    { Header: "Nama Barang", accessor: "barang", width: "10%", align: "left" },
    { Header: "Batch Barang", accessor: "barang_detail", align: "center" },
    { Header: "Jumlah Barang", accessor: "dtransfer_barang_jumlah", align: "center" },
    { Header: "Jumlah Sisa", accessor: "dtransfer_barang_jumlah_belum_terkirim", align: "center" },
    {
      Header: "Jumlah Menunggu Approve",
      accessor: "dtransfer_barang_needapprovekirim",
      align: "center",
    },
    { Header: "Jumlah Terkirim", accessor: "dtransfer_barang_jumlah_terkirim", align: "center" },
    { Header: "Jumlah Kirim", accessor: "jumlah_kirim", align: "center" },
    { Header: "Status Barang", accessor: "dtransfer_barang_status", align: "center" },
  ];

  const rowstransfer = listBarangTransfer.map((item) => ({
    barang: item.barang.barang_nama,
    barang_detail: item.barang_detail.detailbarang_batch,
    dtransfer_barang_jumlah: item.dtransfer_barang_jumlah,
    dtransfer_barang_jumlah_belum_terkirim: item.dtransfer_barang_jumlah_belum_terkirim,
    dtransfer_barang_needapprovekirim: item.dtransfer_barang_needapprovekirim,
    dtransfer_barang_jumlah_terkirim: item.dtransfer_barang_jumlah_terkirim,
    jumlah_kirim: (
      <MDInput
        type="number"
        value={jumlahKirimTransByItem[item.dtransfer_barang_id] || 0}
        onChange={(e) => handleChangeJumlahKirimTransfer(item.dtransfer_barang_id, e.target.value)}
        error={isInputInvalid[item.dtransfer_barang_id]}
        helperText={
          isInputInvalid[item.dtransfer_barang_id] ? "Jumlah melebihi stok yang tersedia" : ""
        }
        sx={{
          "& .MuiInput-root": {
            borderColor: isInputInvalid[item.dtransfer_barang_id] ? "red" : "",
          },
        }}
        inputProps={{ min: 0 }}
      />
    ),
    dtransfer_barang_status:
      item.dtransfer_barang_status === 0
        ? "Sudah Terkirim"
        : item.dtransfer_barang_status === 1
        ? "Belum Terkirim"
        : item.dtransfer_barang_status === 2
        ? "Terkirim Sebagian"
        : item.dtransfer_barang_status === 3
        ? "Ditolak"
        : item.dtransfer_barang_status === 4
        ? "Menunggu "
        : "Tidak ada status",
  }));

  // render Notificartion
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
      <MDBox pt={6} pb={3}>
        {/* Surat Jalan Transfer */}
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Generate Surat Jalan Transfer Barang
                </MDTypography>
              </MDBox>
              <Grid container>
                <Grid item xs={6} pt={4} px={2}>
                  {Array.isArray(htransfer) && htransfer.length > 0 ? (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={htransfer}
                      value={
                        htransfer.find((htrans) => htrans.htransfer_barang_id === idHtransfer) ||
                        null
                      }
                      getOptionLabel={(option) => `${option.htransfer_barang_nota}`}
                      onChange={(event, newValue) => {
                        handleChangeHtransfer(newValue);
                        if (newValue) {
                          setIdHtransfer(newValue.htransfer_barang_id);
                        } else {
                          setIdHtransfer(null);
                        }
                      }}
                      fullWidth
                      renderInput={(params) => <TextField {...params} label="Nomor Nota " />}
                    />
                  ) : (
                    <p>Tidak ada nota barang transfer</p>
                  )}
                </Grid>
                <Grid item xs={6} pt={4} px={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      fullWidth
                      sx={{ width: "100%" }}
                      value={datePickerTransfer}
                      onChange={(newValue) => {
                        // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                        const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                        setDatePickerTransfer(formattedDate);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <br />
              <Grid container px={3}>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Gudang Asal :{" "}
                    {selectedHtransfer ? selectedHtransfer.gudang_asal.gudang_nama : "Pilih Nota"}
                  </MDTypography>
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Gudang Tujuan :{" "}
                    {selectedHtransfer ? selectedHtransfer.gudang_tujuan.gudang_nama : "Pilih Nota"}
                  </MDTypography>
                </Grid>
              </Grid>
              <Grid container px={3}>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Rencana Tanggal Kirim :{" "}
                    {selectedHtransfer
                      ? dayjs(selectedHtransfer.htransfer_barang_tanggal_dikirim).format(
                          "DD-MM-YYYY"
                        )
                      : "Pilih Nota"}
                  </MDTypography>
                </Grid>
              </Grid>
              <MDBox pt={3} pb={4}>
                <DataTable
                  table={{ columns: columnstransfer, rows: rowstransfer }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <Grid item xs={12} px={4} pb={3}>
                <MDButton
                  variant="gradient"
                  color="success"
                  fullWidth
                  onClick={addSuratJalantransfer}
                >
                  Generate Surat Jalan
                </MDButton>
              </Grid>
            </Card>
          </Grid>
          <Grid container spacing={6}>
            {renderSuccessSB}
            {renderErrorSB}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default GenerateSuratJalanByHtrans;

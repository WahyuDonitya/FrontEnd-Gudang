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

function GenerateSuratJalanByHkeluar() {
  // State
  const { dataId } = useParams();
  const [hkeluar, setHkeluar] = useState([]);
  const [selectedHkeluar, setSelectedHkeluar] = useState(null);
  const [selectedNota, setSelectedNota] = useState(null);
  const [listBarang, setListBarang] = useState([]);
  const [jumlahKirimByItem, setJumlahKirimByItem] = useState({});
  const [detailSuratJalan, setDetailSuratJalan] = useState([]);
  const [datePicker, setdatePicker] = useState(null);
  const [idHkeluar, setIdHkeluar] = useState(null);

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
  const getHkeluar = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/suratjalan/get-hkeluar-approved",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setHkeluar(response.data);
      // console.log("data hkeluar : ", response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data HKeluar:", error);
    }
  };

  const handleChange = async (newValue) => {
    if (newValue) {
      setSelectedNota(newValue);
      setSelectedHkeluar(newValue);
      try {
        const response = await axios.get(
          `https://api.tahupoosby.com/api/transaksi-barang/get-dkeluar/${newValue.hkeluar_id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setListBarang(response.data);
        console.log("List barang : ", listBarang);
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data List barang:", error);
      }
    } else {
      setSelectedHkeluar(null);
      setListBarang([]);
      setSelectedNota(null);
    }
  };

  // End API

  useEffect(() => {
    getHkeluar();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  // Function
  const addSuratJalan = async () => {
    if (window.confirm("Apakah data yang dimasukkan sudah benar?")) {
      try {
        if (!selectedNota || !datePicker) {
          alert("Pastikan nomor nota dan tanggal telah ditentukan");
          return;
        }
        const selectedBarang = listBarang
          .filter((item) => jumlahKirimByItem[item.dkeluar_id] > 0)
          .map((item) => ({
            dkeluar_id: item.dkeluar_id,
            barang_nama: item.barang.barang_nama,
            detailbarang_batch: item.d_barang.detailbarang_batch,
            dkeluar_jumlah: item.dkeluar_jumlah,
            dkeluar_harga: item.dkeluar_harga !== null ? item.dkeluar_harga : "Tidak ada harga",
            jumlah_kirim: jumlahKirimByItem[item.dkeluar_id],
          }));

        if (selectedBarang.length === 0) {
          alert("tidak ada barang yang dikirim!");
        } else {
          setDetailSuratJalan(selectedBarang);
          const dataToSend = {
            suratjalan_tanggalkirim: datePicker,
            hkeluar_id: selectedHkeluar.hkeluar_id,
            detail_suratjalan: selectedBarang,
          };

          const response = await axios.post(
            "https://api.tahupoosby.com/api/suratjalan/generate-surat-jalan",
            dataToSend,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          console.log("data to send: ", dataToSend);
          openSuccessSB();
          setSelectedHkeluar(null);
          setListBarang([]);
          setJumlahKirimByItem({});
          setIsInputInvalid({});
          setIdHkeluar(null);
          setdatePicker(null);
          getHkeluar();
        }
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat menambahkan data Surat Jalan:", error);
      }
    }
  };

  const handleChangeJumlahKirim = (itemId, newValue) => {
    const currentItem = listBarang.find((item) => item.dkeluar_id === itemId);

    // Create a copy of the existing isInputInvalid state
    const updatedIsInputInvalid = { ...isInputInvalid };

    // Update the validity for the current item
    if (newValue > currentItem.dkeluar_sisa) {
      updatedIsInputInvalid[itemId] = true;
    } else {
      updatedIsInputInvalid[itemId] = false;
    }

    setIsInputInvalid(updatedIsInputInvalid);

    if (!updatedIsInputInvalid[itemId]) {
      setJumlahKirimByItem((prev) => ({
        ...prev,
        [itemId]: parseInt(newValue),
      }));
    }
  };

  const columns = [
    { Header: "Nama Barang", accessor: "barang", width: "10%", align: "left" },
    { Header: "Batch Barang", accessor: "d_barang", align: "center" },
    { Header: "Jumlah Barang", accessor: "dkeluar_jumlah", align: "center" },
    { Header: "Jumlah Sisa", accessor: "dkeluar_sisa", align: "center" },
    { Header: "Jumlah Menunggu Approve", accessor: "dkeluar_needapprovekirim", align: "center" },
    { Header: "Jumlah Rusak", accessor: "rusak", align: "center" },
    { Header: "Jumlah Terkirim", accessor: "dkeluar_terkirim", align: "center" },
    { Header: "Jumlah Kirim", accessor: "jumlah_kirim", align: "center" },
    { Header: "Status Barang", accessor: "dkeluar_status", align: "center" },
  ];

  const rows = listBarang.map((item) => ({
    barang: item.barang.barang_nama,
    d_barang: item.d_barang.detailbarang_batch,
    dkeluar_jumlah: item.dkeluar_jumlah,
    dkeluar_sisa: item.dkeluar_sisa,
    rusak: item.dkeluar_rusak,
    dkeluar_needapprovekirim: item.dkeluar_needapprovekirim,
    dkeluar_terkirim: item.dkeluar_terkirim,
    jumlah_kirim: (
      <MDInput
        type="number"
        value={jumlahKirimByItem[item.dkeluar_id] || 0}
        onChange={(e) => handleChangeJumlahKirim(item.dkeluar_id, e.target.value)}
        error={isInputInvalid[item.dkeluar_id]}
        helperText={isInputInvalid[item.dkeluar_id] ? "Jumlah melebihi stok yang tersedia" : ""}
        sx={{ "& .MuiInput-root": { borderColor: isInputInvalid[item.dkeluar_id] ? "red" : "" } }}
        inputProps={{ min: 0 }}
      />
    ),
    dkeluar_status:
      item.dkeluar_status === 0
        ? "Sudah Terkirim"
        : item.dkeluar_status === 1
        ? "Terkirim Sebagian"
        : item.dkeluar_status === 2
        ? "Belum Terkirim"
        : "Tidak ada harga",
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
                  Generate Surat Jalan
                </MDTypography>
              </MDBox>
              <Grid container>
                <Grid item xs={6} pt={4} px={2}>
                  {Array.isArray(hkeluar) && hkeluar.length > 0 ? (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={hkeluar}
                      getOptionLabel={(option) => `${option.hkeluar_nota || "kosong"}`}
                      value={hkeluar.find((hkel) => hkel.hkeluar_id === idHkeluar) || null}
                      onChange={(event, newValue) => {
                        handleChange(newValue);
                        if (newValue) {
                          setIdHkeluar(newValue.hkeluar_id);
                        } else {
                          setIdHkeluar(null);
                        }
                      }}
                      fullWidth
                      renderInput={(params) => <TextField {...params} label="Nomor Nota " />}
                    />
                  ) : (
                    <p>Tidak ada nota barang keluar</p>
                  )}
                </Grid>
                <Grid item xs={6} pt={4} px={2}>
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
              </Grid>
              <br />
              <Grid container px={3}>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Nama Customer :{" "}
                    {selectedHkeluar ? selectedHkeluar.customer.customer_nama : "Pilih Nota"}
                  </MDTypography>
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Alamat Customer :{" "}
                    {selectedHkeluar ? selectedHkeluar.customer.customer_alamat : "Pilih Nota"}
                  </MDTypography>
                </Grid>
              </Grid>
              <Grid container px={3}>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Telepon Customer :{" "}
                    {selectedHkeluar ? selectedHkeluar.customer.customer_telepon : "Pilih Nota"}
                  </MDTypography>
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Dari Gudang :{" "}
                    {selectedHkeluar ? selectedHkeluar.gudang.gudang_nama : "Pilih Nota"}
                  </MDTypography>
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Rencana tanggal kirim :{" "}
                    {selectedHkeluar
                      ? dayjs(selectedHkeluar.hkeluar_tanggal).format("DD-MM-YYYY")
                      : "Pilih Nota"}
                  </MDTypography>
                </Grid>
              </Grid>
              <MDBox pt={3} pb={4}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <Grid item xs={12} px={4} pb={3}>
                <MDButton variant="gradient" color="success" fullWidth onClick={addSuratJalan}>
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

export default GenerateSuratJalanByHkeluar;

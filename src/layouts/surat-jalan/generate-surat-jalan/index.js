/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

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
import { useNavigate } from "react-router-dom";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";

// import projectsTableData from "layouts/tables/data/projectsTableData";

function GenerateSuratJalan() {
  // State
  const [hkeluar, setHkeluar] = useState([]);
  const [htransfer, setHtransfer] = useState([]);
  const [selectedHtransfer, setSelectedHtransfer] = useState(null);
  const [listBarangTransfer, setListBarangTransfer] = useState([]);
  const [selectedTransferNota, setSelectedTransferNota] = useState(null);
  const [selectedHkeluar, setSelectedHkeluar] = useState(null);
  const [selectedNota, setSelectedNota] = useState(null);
  const [listBarang, setListBarang] = useState([]);
  const [jumlahKirimByItem, setJumlahKirimByItem] = useState({});
  const [jumlahKirimTransByItem, setJumlahKirimTransByItem] = useState({});
  const [detailSuratJalan, setDetailSuratJalan] = useState([]);
  const [datePicker, setdatePicker] = useState(null);
  const [datePickerTransfer, setDatePickerTransfer] = useState(null);
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

  // API
  const getHkeluar = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/suratjalan/get-hkeluar-approved",
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

  const getHtransfer = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/suratjalan/get-htransfer-approved",
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

  const handleChange = async (newValue) => {
    if (newValue) {
      setSelectedNota(newValue);
      setSelectedHkeluar(newValue);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/transaksi-barang/get-dkeluar/${newValue.hkeluar_id}`,
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

  const handleChangeHtransfer = async (newValue) => {
    if (newValue) {
      setSelectedHtransfer(newValue);
      setSelectedTransferNota(newValue);
      console.log(newValue.htransfer_barang_id);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/suratjalan/get-dtransfer-approved/${newValue.htransfer_barang_id}`,
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
    getHkeluar();
    getHtransfer();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  // ini pengganti web socket dengan melakukan pengambilan data ke API lagi setiap 10 detik sekali
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:8000/api/suratjalan/get-hkeluar-approved", {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       const data = await response.json();

  //       console.log("Data terbaru:", data);
  //       // Implementasikan logika pembaruan tampilan di sini
  //       setHkeluar(data);
  //     } catch (error) {
  //       console.error("Terjadi kesalahan:", error);
  //     }
  //   };

  //   // Panggil fetchData pertama kali
  //   fetchData();

  //   // Atur interval untuk memanggil fetchData setiap 5 detik
  //   const intervalId = setInterval(() => {
  //     fetchData();
  //   }, 15000);

  //   // Membersihkan interval saat komponen di-unmount
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

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
            "http://127.0.0.1:8000/api/suratjalan/generate-surat-jalan",
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

        setDetailSuratJalan(selectedBarang);
        const dataToSend = {
          suratjalantransfer_tanggalkirim: datePickerTransfer,
          htransfer_barang_id: selectedHtransfer.htransfer_barang_id,
          detail_suratjalantransfer: selectedBarang,
        };

        const response = await axios.post(
          "http://127.0.0.1:8000/api/suratjalan/generate-transfer-surat-jalan",
          dataToSend,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // console.log("data to send: ", dataToSend);
        openSuccessSB();
        setSelectedHtransfer(null);
        setListBarangTransfer([]);
        setJumlahKirimTransByItem({});
        getHtransfer();
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat menambahkan data Surat Jalan:", error);
      }
    }
  };
  //   // Dapatkan item yang sesuai dengan itemId
  //   const currentItem = listBarang.find((item) => item.dkeluar_id === itemId);

  //   const updatedIsInputInvalid = { ...isInputInvalid };

  //   // Cek apakah nilai yang diinputkan lebih besar dari dkeluar_sisa
  //   if (newValue > currentItem.dkeluar_sisa) {
  //     setIsInputInvalid(true);
  //   } else {
  //     setIsInputInvalid(false);
  //     setJumlahKirimByItem((prev) => ({
  //       ...prev,
  //       [itemId]: parseInt(newValue),
  //     }));
  //   }
  // };

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

  const columns = [
    { Header: "Nama Barang", accessor: "barang", width: "10%", align: "left" },
    { Header: "Batch Barang", accessor: "d_barang", align: "center" },
    { Header: "Jumlah Barang", accessor: "dkeluar_jumlah", align: "center" },
    { Header: "Jumlah Sisa", accessor: "dkeluar_sisa", align: "center" },
    { Header: "Jumlah Menunggu Approve", accessor: "dkeluar_needapprovekirim", align: "center" },
    { Header: "Jumlah Terkirim", accessor: "dkeluar_terkirim", align: "center" },
    { Header: "Jumlah Kirim", accessor: "jumlah_kirim", align: "center" },
    { Header: "Status Barang", accessor: "dkeluar_status", align: "center" },
  ];

  const rows = listBarang.map((item) => ({
    barang: item.barang.barang_nama,
    d_barang: item.d_barang.detailbarang_batch,
    dkeluar_jumlah: item.dkeluar_jumlah,
    dkeluar_sisa: item.dkeluar_sisa,
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
                    <p>Loading customer data...</p>
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
                      getOptionLabel={(option) => `${option.htransfer_barang_nota}`}
                      onChange={(event, newValue) => {
                        handleChangeHtransfer(newValue);
                      }}
                      fullWidth
                      renderInput={(params) => <TextField {...params} label="Nomor Nota " />}
                    />
                  ) : (
                    <p>Loading customer data...</p>
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

export default GenerateSuratJalan;

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

function PackagingLast() {
  // State
  const [customer, setCustomer] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [gudangs, setGudangs] = useState([]);
  const [customerPick, setCustomerPick] = useState("");
  const [gudangPick, setGudangPick] = useState(null);
  const [datePicker, setdatePicker] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [pelaku, setPelaku] = useState("");

  // ini untuk inputan dynamic table
  const [inputDetailBarangId, setInputDetailBarangId] = useState("");
  const [inputBarangBatch, setInputBarangBatch] = useState("");
  const [inputBarangStok, setInputBarangStok] = useState(null);
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
      const response = await axios.get("https://api.tahupoosby.com/api/gudang", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setGudangs(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Customer:", error);
    }
  };

  const getBarang = async () => {
    try {
      const response = await axios.get("https://api.tahupoosby.com/api/packaging/get-polos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const currentDate = new Date();
      const filteredData = response.data.filter((data) => {
        return new Date(data.detailbarang_expdate) > currentDate;
      });
      setBarangs(filteredData);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Customer:", error);
    }
  };

  const addBarangKeluar = async () => {
    if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
      if (pelaku == "") {
        alert("Mohon isi semua form");
      } else {
        if (data.length > 0) {
          const selectedBarang = dataToSubmit.filter(
            (item) => item.dkeluar_jumlah == 0 || Number.isNaN(item.detailbarang_stok)
          );
          if (selectedBarang.length > 0) {
            alert("Terdapat data yang kosong pada table");
            return;
          }
          try {
            const dataToSend = {
              pelaku: pelaku,
              detail_packaging: dataToSubmit,
            };

            console.log("value data to send: ", dataToSend);

            const response = await axios.post(
              "https://api.tahupoosby.com/api/packaging/add-packaging",
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
            setCustomerId(null);
            setPelaku("");
          } catch (error) {
            openErrorSB();
            console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
          }
        } else {
          alert("data yang akan dimasukkan kosong");
        }
      }
    }
  };

  // End API

  const handleAdd = () => {
    if (inputBarangBatch == "" || inputKeluarJumlah == "") {
      alert("Mohon isi semua field");
    } else {
      const detailbarangId = parseInt(inputDetailBarangId);

      const existingItemIndex = dataToSubmit.findIndex(
        (item) => item.detailbarang_id === detailbarangId
      );

      if (existingItemIndex !== -1) {
        alert(
          "Barang sudah ditambahkan sebelumnya! Jika ingin melakukan update harap hapus data yang ada pada Table"
        );
        return;
      }

      const newDetailTransaksi = {
        detailbarang_id: detailbarangId,
        jumlah: parseInt(inputKeluarJumlah),
      };
      dataToSubmit.push(newDetailTransaksi);
      console.log(dataToSubmit);

      // ini untuk memunculkan ke dynamic table
      const newData = {
        inputBarangBatch,
        inputKeluarJumlah: inputKeluarJumlah.toString(),
        barang_stok: parseInt(inputBarangStok),
      };

      setData([...data, newData]);

      setInputDetailBarangId("");
      setInputBarangBatch("");
      setInputBarangStok(null);
      setinputKeluarJumlah("");
      setHargaKeluar("");
      // console.log(dataToSubmit);
    }
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

  const handleInputChangeBarang = (newValue) => {
    setInputBarangBatch(newValue);
  };

  const handleChangeJumlahKeluar = async (index, newValue, stok) => {
    // Salin data dari data dan dataToSubmit
    const updatedData = [...data];
    const updatedDataToSubmit = [...dataToSubmit];

    if (newValue > stok) {
      alert("Jumlah melebihi stok yang dimaksud");
      return;
    }

    updatedData[index].inputKeluarJumlah = newValue;
    updatedDataToSubmit[index].jumlah = newValue;

    setData(updatedData);

    console.log(dataToSubmit);
  };

  useEffect(() => {
    getBarang();
    getGudang();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
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

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Batch Barang Tahu Polo", accessor: "nama", align: "center" },
    { Header: "Jumlah Barang ", accessor: "jumlah", align: "center" },
    { Header: "Stok Barang", accessor: "stokbarang", align: "center" },
    { Header: "Action ", accessor: "action", align: "center" },
  ];

  const rows = data.map((item, index) => {
    return {
      index: index + 1,
      nama: item.inputBarangBatch,
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
      stokbarang: item.barang_stok,
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
            Packaging Barang Form
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            {/* Pelaku */}
            <Grid item xs={12}>
              <MDInput
                label="Penanggung Jawab"
                fullWidth
                type="text"
                value={pelaku}
                onChange={(e) => {
                  setPelaku(e.target.value);
                }}
              />
            </Grid>

            {/* Barang */}
            <Grid item xs={6}>
              {Array.isArray(barangs) && barangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={
                    barangs.find((barang) => barang.detailbarang_id === inputDetailBarangId) || null
                  }
                  options={barangs}
                  getOptionLabel={(option) => `${option.detailbarang_batch || "Gamuncul"}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setInputDetailBarangId(newValue.detailbarang_id);
                      setInputBarangBatch(newValue.detailbarang_batch);
                      setInputBarangStok(newValue.detailbarang_stok);
                    } else {
                      setInputDetailBarangId("");
                      setInputBarangBatch("");
                      setInputBarangStok(null);
                    }

                    console.log(barangs);
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Batch Tahu Polos" />}
                />
              ) : (
                <p>Data Customer tidak ditemukan...</p>
              )}
            </Grid>

            {/* Jumlah barang keluar */}
            <Grid item xs={6}>
              <TextField
                label="Jumlah Barang Pack"
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

export default PackagingLast;

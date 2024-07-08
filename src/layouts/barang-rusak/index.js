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
// import { makeStyles } from "@mui/styles";
// import { makeStyles } from "@mui/material";
import Footer from "examples/Footer";

import Header from "./components/Header";
import {
  Autocomplete,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Paper,
  IconButton,
  Icon,
  Button,
} from "@mui/material";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format as dateFnsFormat } from "date-fns";
import dayjs from "dayjs";
import MDInput from "components/MDInput";
import { useNavigate } from "react-router-dom";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import DataTable from "examples/Tables/DataTable";
import { jwtDecode } from "jwt-decode";

// const useStyles = makeStyles((theme) => ({
//   input: {
//     display: "none",
//   },
// }));

function GenerateBarangRusak() {
  const [barangs, setBarangs] = useState([]);
  const [batch, setBatch] = useState("");
  const [detailBarang, setDetailBarang] = useState([]);
  const [penempatanBarang, setPenempatanBarang] = useState([]);
  const [detailBarangStok, setDetailBarangStok] = useState(null);
  const [detailBarangByBatch, setDetailBarangByBatch] = useState([]);
  const [catatan, setCatatan] = useState("");
  const [pelaku, setPelaku] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [penempatanId, setPenempatanId] = useState(null);
  const [detailBarangPick, setDetailBarangPick] = useState(null);

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
  let gudangId = jwtDecode(accessToken);

  // API

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

  const addBarangRusak = async () => {
    if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
      if (catatan == "" || pelaku == "" || data.length == 0) {
        alert("Lengkapi form terlebih dahulu!");
      } else {
        try {
          // console.log("nota supplier", notaSupplier);
          const dataKirim = {
            hbarangrusak_kronologi: catatan,
            hbarangrusak_pelaku: pelaku,
            // file_foto: selectedFile,
            detailrusak: dataToSubmit,
          };

          console.log("hasil data kirim ", dataKirim);
          const response = await axios.post(
            "http://127.0.0.1:8000/api/barang-rusak/add-barang-rusak",
            dataKirim,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          openSuccessSB();
          console.log(response);
          setData([]);
          setCatatan("");
          setPelaku("");
          setinputMasukJumlah("");
          setBatch("");
          setDataToSubmit([]);
        } catch (error) {
          openErrorSB();
          console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
        }
      }
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
    const currentDate = new Date();
    const filteredData = response.data.filter((data) => {
      return new Date(data.detailbarang_expdate) > currentDate;
    });
    setDetailBarang(filteredData);
  };

  const handleSetBatch = async (batchlok) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/detailbarang/get-detail-barang-by-batch/${batchlok.detailbarang_batch}/${inputBarangId}/${gudangId.gudang_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const res = await axios.get(
        `http://127.0.0.1:8000/api/positioning/get-penempatan-by-detailbarang/${batchlok.detailbarang_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log("Data Detail barang:", batchlok);
      if (batchlok.detailbarang_jumlahplacement > 0) {
        const additionalData = {
          penempatan_id: "Bulk",
          get_rack: {
            get_rows: { row_name: " : Bulk" },
            rack_bay: " : Bulk",
            rack_level: " : Bulk",
          },
        };
        setPenempatanBarang([additionalData, ...res.data]);
      } else {
        setPenempatanBarang(res.data);
      }
      console.log("Ini penempatan barang ", penempatanBarang);
      // setDetailBarangStok(response.data.detailbarang_stok);
      setDetailBarangByBatch(response.data);
      console.log(response.data);
      setDetailBarangPick(batchlok);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  // End API

  const handleAdd = () => {
    // console.log(batch);
    if (isInputInvalid || inputBarangId == null || batch == "" || inputMasukJumlah == "") {
      alert("Terdapat field yang belum diisi");
    } else {
      const barangId = parseInt(inputBarangId);

      const existingItemIndex = dataToSubmit.findIndex(
        (item) => item.barang_id === barangId && item.detailbarang_batch === batch
      );

      if (existingItemIndex !== -1) {
        alert("Barang dengan batch yang sama sudah ditambahkan sebelumnya!");
        return;
      }

      const newBarangMasuk = {
        barang_id: parseInt(barangId),
        detailbarang_jumlahrusak: parseInt(inputMasukJumlah),
        detailbarang_batch: batch,
        detailbarang_id: detailBarangByBatch.detailbarang_id,
        file_foto: selectedFile,
        penempatanproduk_id: penempatanId,
      };
      dataToSubmit.push(newBarangMasuk);
      console.log(dataToSubmit);

      // console.log("hasil dari data to submit : ", dataToSubmit);

      // ini untuk memunculkan ke dynamic table
      const newData = {
        inputBarangNama,
        detailbarang_stok: inputMasukJumlah.toString(),
        detailbarang_batch: batch,
        stok: detailBarangStok,
      };

      setData([...data, newData]);

      // Membuat input file baru
      const newFileInput = document.createElement("input");
      newFileInput.type = "file";
      newFileInput.id = "contained-button-file";
      newFileInput.onchange = handleFileChange;

      // Hapus input file yang lama dari DOM
      const oldFileInput = document.getElementById("contained-button-file");
      oldFileInput.parentNode.replaceChild(newFileInput, oldFileInput);

      setInputBarangId(null);
      setInputBarangNama(null);
      setInputBarangStok(null);
      setSelectedFile(null);
      setDetailBarangPick(null);
      setPenempatanId(null);
      setinputMasukJumlah("");
      setBatch("");
      setDetailBarang([]);
      setDetailBarangStok(null);
      setPenempatanBarang([]);
      console.log(dataToSubmit);
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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

  const handleStokChange = (newValue) => {
    const numericValue = parseInt(newValue);
    // console.log(detailBarangStok);
    if (numericValue > detailBarangStok) {
      alert(`Barang yang anda pilih hanya memiliki stok : ${detailBarangStok}`);
      setIsInputInvalid(true);
    } else {
      setIsInputInvalid(false);
      setinputMasukJumlah(numericValue);
    }

    // if (isInputInvalid == true) {
    //   setinputMasukJumlah((prev) => {
    //     prev;
    //   });
    // }
  };

  const handleSetPenempatan = (newValue) => {
    // console.log(newValue, detailBarangPick);
    if (newValue.penempatan_id == "Bulk") {
      setDetailBarangStok(detailBarangPick.detailbarang_jumlahplacement);
    } else {
      setDetailBarangStok(newValue.penempatanproduk_jumlah);
      setPenempatanId(newValue.penempatanproduk_id);
    }
  };

  const handleChangeJumlahKeluar = async (index, newValue, stok) => {
    // Salin data dari data dan dataToSubmit
    const updatedData = [...data];
    const updatedDataToSubmit = [...dataToSubmit];

    if (newValue > stok) {
      alert("Jumlah melebihi stok yang dimaksud");
      return;
    }

    updatedData[index].detailbarang_stok = newValue;
    updatedDataToSubmit[index].detailbarang_jumlahrusak = newValue;

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

  // INI UNTUK GAMBAR

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Maksimal file adalah 2MB");
        return;
      } else {
        const base64Image = await convertImageToBase64(file);
        setSelectedFile(base64Image);
      }
    }
  };

  const handleUpload = () => {
    // Lakukan pengiriman file ke server di sini
    console.log("File yang dipilih:", selectedFile);
  };
  // END GAMBAR

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang ", accessor: "nama", align: "center" },
    { Header: "Jumlah Barang ", accessor: "jumlah", align: "center" },
    { Header: "Batch ", accessor: "batch", align: "center" },
    { Header: "Stok Barang ", accessor: "stok", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = data.map((item, index) => {
    return {
      index: index + 1,
      nama: item.inputBarangNama,
      jumlah: (
        <MDInput
          type="number"
          value={item.detailbarang_stok || 0}
          onChange={(e) => handleChangeJumlahKeluar(index, parseInt(e.target.value), item.stok)}
          inputProps={{ min: 0 }}
        />
      ),
      batch: item.detailbarang_batch,
      stok: item.stok,
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
          <Grid container pt={3} spacing={7}>
            {/* Untuk Autocomplete nama barang */}

            {/* Untuk catatan kirim Mutasi */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="medium">
                Ceritakan Kejadian
              </MDTypography>
              <br />
              <MDInput
                label="Kronologi"
                fullWidth
                type="text"
                value={catatan}
                onChange={(e) => {
                  setCatatan(e.target.value);
                }}
              />
            </Grid>

            {/* Untuk pelaku */}
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

            <Grid item xs={6}>
              <MDTypography variant="h6" fontWeight="medium">
                Pilih Barang Rusak
              </MDTypography>
              <br />
              {Array.isArray(barangs) && barangs.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={barangs}
                  value={barangs.find((barang) => barang.barang_id === inputBarangId) || null}
                  getOptionLabel={(option) => `${option.barang_nama || "gaada nama"}`}
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
                      handleSetBatch(newValue);
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

            {/* Untuk Autocomplete Nomor batch barang */}
            <Grid item xs={6}>
              {Array.isArray(penempatanBarang) && penempatanBarang.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={penempatanBarang}
                  getOptionLabel={(option) =>
                    `Rows ${option.get_rack.get_rows.row_name}, Sel ${option.get_rack.rack_bay}, level ${option.get_rack.rack_level} `
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      // setBatch(newValue.detailbarang_batch);
                      // handleSetBatch(newValue);
                      handleSetPenempatan(newValue);
                    } else {
                      // setDetailBarangStok(null);
                      // setBatch("");
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Penempatan Barang" />}
                />
              ) : (
                <p>Data Penempatan tidak ditemukan...</p>
              )}
            </Grid>

            {/* untuk Jumlah barang yang akan dimutasi */}
            <Grid item xs={6}>
              <MDInput
                label="Jumlah barang rusak"
                fullWidth
                type="number"
                value={inputMasukJumlah}
                onChange={(e) => {
                  handleStokChange(e.target.value);
                  // setinputMasukJumlah(e.target.value);
                }}
                error={isInputInvalid}
                helperText={isInputInvalid ? "Jumlah melebihi stok yang tersedia" : ""}
                sx={{
                  "& .MuiInput-root": { borderColor: isInputInvalid ? "red" : "" },
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <input id="contained-button-file" type="file" onChange={handleFileChange} />
              {selectedFile && <div>File yang dipilih: {selectedFile.name}</div>}
            </Grid>

            {/* Button Add */}
            <Grid item xs={12}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleAdd}>
                Add Row
              </MDButton>
            </Grid>

            {/* Untuk data table */}
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

            {/* Untuk Add data ke DB */}
            <Grid item xs={12}>
              <MDButton variant="gradient" color="success" fullWidth onClick={addBarangRusak}>
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
    </DashboardLayout>
  );
}

export default GenerateBarangRusak;

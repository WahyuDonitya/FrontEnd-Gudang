import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Header from "./components/Header";
import { Autocomplete, Divider, TextField, Icon, AppBar, Tabs, Tab } from "@mui/material";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MDInput from "components/MDInput";
import breakpoints from "assets/theme/base/breakpoints";
import DataTable from "examples/Tables/DataTable";
import { Link, useNavigate } from "react-router-dom";

function StokOpname() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [dataOpname, setDataOpname] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [datePickerend, setdatePickerend] = useState(null);
  const [datePickerstart, setdatePickerstart] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [headerOpname, setHeaderOpname] = useState([]);
  const [detaiBarangOpname, setDetailBarangOpname] = useState([]);
  const [jumlahAktualByItem, setJumlahAktualByItem] = useState({});
  const [jumlahDifferenceByItem, setJumlahDifferenceByItem] = useState({});
  const [keteranganByItem, setKeteranganByItem] = useState({});
  const [isInputInvalid, setIsInputInvalid] = useState({});
  const [opnameId, setOpnameId] = useState(null);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  // ini untuk handlechange input stok
  //   const [isInputInvalid, setIsInputInvalid] = useState(false);

  const accessToken = localStorage.getItem("access_token");

  // API

  const addGenerateOpname = async () => {
    if (datePickerstart == null || datePickerend == null) {
      alert("Terdapat field yang kosong");
    } else {
      if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
        try {
          const dataKirim = {
            datePickerstart: datePickerstart,
            datePickerend: datePickerend,
            opname_catatan: catatan,
          };

          // console.log("hasil data kirim ", dataKirim);
          const response = await axios.post(
            "http://127.0.0.1:8000/api/stok-opname/generate-stok-opname",
            dataKirim,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          openSuccessSB();
          console.log("berhasil input");
          setCatatan("");
          setdatePickerend(null);
          setdatePickerstart(null);
          getDataStokOpname();
        } catch (error) {
          openErrorSB();
          console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
        }
      }
    }
  };

  const addFormOpname = async () => {
    if (window.confirm("Apakah data yang anda masukkan sudah benar? ")) {
      try {
        let isInputValid = true;

        if (
          detaiBarangOpname.some((item) => jumlahAktualByItem[item.detailbarangopname_id] == null)
        ) {
          isInputValid = false;
        }

        if (!isInputValid) {
          alert("Ada jumlah aktual yang belum diisi");
        } else {
          const selectedBarang = detaiBarangOpname.map((item) => ({
            detailbarangopname_id: item.detailbarangopname_id,
            detailbarangopname_jumlahaktual: jumlahAktualByItem[item.detailbarangopname_id],
            detailbarangopname_jumlahdifference: jumlahDifferenceByItem[item.detailbarangopname_id],
            detailbarangopname_catatan:
              keteranganByItem[item.detailbarangopname_id] || "Tidak Ada Keterangan",
          }));

          const datakirim = {
            detailbarang_opname: selectedBarang,
            opname_id: opnameId,
          };

          console.log(datakirim);

          const response = await axios.post(
            "http://127.0.0.1:8000/api/stok-opname/stok-opname-form",
            datakirim,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("ini response : ", response.data);
          openSuccessSB();
          setOpnameId(null);
          setKeteranganByItem({});
          setJumlahAktualByItem({});
          setJumlahDifferenceByItem({});
          setDetailBarangOpname([]);
          getHeaderOpname();
          getDataStokOpname();
        }
      } catch (error) {
        console.log("terdapat error saat menjalankan stok opname ", error);
        openErrorSB();
      }
    }
  };

  const getDataStokOpname = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/stok-opname/get-stok-opname-list`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setDataOpname(response.data);
    } catch (error) {
      console.log("Terdapat error saat mengambil data stok opname ".error);
    }
  };

  const getHeaderOpname = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/stok-opname/get-header-opname-berlangsung`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setHeaderOpname(res.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data stok opname ", error);
    }
  };

  const handleCustomerInputChange = async (value) => {
    if (value) {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/stok-opname/get-detail-barang/${value.opname_id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // console.log(res.data);
      setDetailBarangOpname(res.data);
      setOpnameId(value.opname_id);
    } else {
      setDetailBarangOpname([]);
      setOpnameId(null);
    }
  };

  // End API

  // function

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleChangeJumlahAktual = (itemId, newValue, jumlahditempat) => {
    const currentItem = detaiBarangOpname.find((item) => item.detailbarangopname_id === itemId);
    const updatedIsInputInvalid = { ...isInputInvalid };

    updatedIsInputInvalid[itemId] = false;

    setIsInputInvalid(updatedIsInputInvalid);

    if (!updatedIsInputInvalid[itemId]) {
      setJumlahAktualByItem((prev) => ({
        ...prev,
        [itemId]: parseInt(newValue),
      }));
      setJumlahDifferenceByItem((prev) => ({
        ...prev,
        [itemId]: parseInt(newValue) - parseInt(jumlahditempat),
      }));
    }
  };

  const handleChangeKeterangan = (itemId, newValue) => {
    setKeteranganByItem((prev) => ({
      ...prev,
      [itemId]: newValue || "",
    }));
  };

  // end Function

  useEffect(() => {
    getDataStokOpname();
    getHeaderOpname();
  }, []);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const hasToken = !!localStorage.getItem("access_token");
  //   if (!hasToken) {
  //     navigate("/authentication/sign-in");
  //   }
  // }, [navigate]);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    window.addEventListener("resize", handleTabsOrientation);

    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  // render data
  const columns = [
    { Header: "Nota Opname", accessor: "opname_nota", align: "center" },
    { Header: "Periode", accessor: "opname_periode", align: "center" },
    { Header: "Dari Tanggal", accessor: "opname_date_start", align: "center" },
    { Header: "Sampai tanggal", accessor: "opname_date_end", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Pemberi aksi", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "Status", accessor: "opname_status", align: "left" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = dataOpname.map((item) => ({
    opname_nota: item.opname_nota,
    opname_periode: item.opname_periode,
    opname_date_start: item.opname_date_start,
    opname_date_end: item.opname_date_end,
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama },
    pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
    opname_status:
      item.opname_status == 0
        ? "Belum Berlangsung"
        : item.opname_status == 1
        ? "Opname Berlangsung"
        : item.opname_status == 2
        ? "Opname Selesai"
        : item.opname_status == 3
        ? "Opname Ditolak"
        : "Approved dan sudah dilakukan penyesuaian",
    action: (
      <Link to={`/stok-opname/${item.opname_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Detail
        </MDTypography>
      </Link>
    ),
    //   action_print:
    //     item.suratjalan_status === 3 ? (
    //       <Link to={`/detailsurat-jalan/${item.suratjalan_nota}`}>
    //         <MDTypography variant="caption" color="text" fontWeight="medium">
    //           Print
    //         </MDTypography>
    //       </Link>
    //     ) : null,
  }));

  const columnsform = [
    {
      Header: "Nama Barang",
      accessor: "namabarang",
      width: "10%",
      align: "left",
    },
    { Header: "lokasi Barang", accessor: "lokasi", align: "center" },
    { Header: "Batch Barang", accessor: "batch", align: "center" },
    { Header: "Jumlah Tercatat", accessor: "detailbarangopname_jumlahditempat", align: "center" },
    { Header: "Jumlah Aktual", accessor: "aktual", align: "center" },
    { Header: "Jumlah Difference", accessor: "difference", align: "center" },
    { Header: "Keterangan", accessor: "keterangan", align: "center" },
  ];

  const rowsform = detaiBarangOpname.map((item) => ({
    namabarang: item.detail_barang.barang.barang_nama,
    batch: item.detail_barang.detailbarang_batch,
    lokasi: item.penempatanproduk_id
      ? "Rows : " +
        (item.penempatan_produk
          ? item.penempatan_produk.get_rack?.get_rows.row_name || "Di Bulk"
          : "Di Bulk") +
        " Sel: " +
        (item.penempatan_produk?.get_rack?.rack_bay || "Di Bulk") +
        " Level: " +
        (item.penempatan_produk?.get_rack?.rack_level || "Di Bulk")
      : "Di Bulk",
    detailbarangopname_jumlahditempat: item.detailbarangopname_jumlahditempat,
    aktual: (
      <MDInput
        type="number"
        value={jumlahAktualByItem[item.detailbarangopname_id]}
        onChange={(e) =>
          handleChangeJumlahAktual(
            item.detailbarangopname_id,
            e.target.value,
            item.detailbarangopname_jumlahditempat
          )
        }
        error={isInputInvalid[item.detailbarangopname_id]}
        helperText={
          isInputInvalid[item.detailbarangopname_id] ? "Jumlah melebihi stok yang tersedia" : ""
        }
        sx={{
          "& .MuiInput-root": {
            borderColor: isInputInvalid[item.detailbarangopname_id] ? "red" : "",
          },
        }}
        inputProps={{ min: 0 }}
      />
    ),
    difference: (
      <MDInput type="number" value={jumlahDifferenceByItem[item.detailbarangopname_id]} disabled />
    ),
    keterangan: (
      <MDInput
        type="text"
        value={keteranganByItem[item.detailbarangopname_id]}
        onChange={(e) => handleChangeKeterangan(item.detailbarangopname_id, e.target.value)}
      />
    ),
  }));

  // end render data

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

  const renderForm = () => {
    if (tabValue === 0) {
      // Jika tab "Baris" yang aktif
      return (
        <>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                fullWidth
                sx={{ width: "100%" }}
                value={datePickerstart}
                onChange={(newValue) => {
                  // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                  const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                  setdatePickerstart(formattedDate);
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                fullWidth
                sx={{ width: "100%" }}
                value={datePickerend}
                onChange={(newValue) => {
                  // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                  const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                  setdatePickerend(formattedDate);
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* field catatan */}
          <Grid item xs={12}>
            <TextField
              label="Catatan Stok Opname"
              fullWidth
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </Grid>
          {/* Untuk Add data ke DB */}
          <Grid item xs={12}>
            <MDButton variant="gradient" color="success" fullWidth onClick={addGenerateOpname}>
              Generate Opname
            </MDButton>
          </Grid>
          <Grid item xs={12}>
            <MDBox pt={3}>
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={true}
                showTotalEntries={true}
                noEndBorder
                canSearch
              />
              {/* <Grid item xs={12} px={2} pb={3} pt={5}>
              <MDButton variant="gradient" color="success" onClick={handlePrint}>
                Print
              </MDButton>
            </Grid> */}
            </MDBox>
          </Grid>
        </>
      );
    } else {
      // Jika tab "Rak" yang aktif
      return (
        <>
          <Grid item xs={12}>
            {Array.isArray(headerOpname) && headerOpname.length > 0 ? (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={headerOpname}
                getOptionLabel={(option) => `${option.opname_nota}`}
                onChange={(event, newValue) => {
                  //   setGudangPick(newValue.gudang_id);
                  handleCustomerInputChange(newValue);
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Pilih Header Opname" />}
              />
            ) : (
              <p>Loading customer data...</p>
            )}
          </Grid>

          {/* datatable */}
          <Grid item xs={12}>
            <MDBox pt={3}>
              <DataTable
                table={{ columns: columnsform, rows: rowsform }}
                isSorted={false}
                entriesPerPage={true}
                showTotalEntries={true}
                noEndBorder
                canSearch
              />
              {/* <Grid item xs={12} px={2} pb={3} pt={5}>
              <MDButton variant="gradient" color="success" onClick={handlePrint}>
                Print
              </MDButton>
            </Grid> */}
            </MDBox>
          </Grid>
          {/* end datatable */}

          {/* Untuk Add data ke DB */}
          <Grid item xs={12}>
            <MDButton variant="gradient" color="success" fullWidth onClick={addFormOpname}>
              Add data
            </MDButton>
          </Grid>
          {/* Tambahkan elemen-elemen form tambahan sesuai kebutuhan */}
        </>
      );
    }
  };

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
            {tabValue === 0 ? "Generate Form stok opname" : "Pengisian Stok Opname"}
          </MDTypography>
          <Grid container pt={3} spacing={7}>
            <Grid item xs={6} md={7} lg={7} sx={{ ml: "auto" }}>
              <AppBar position="static">
                <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                  <Tab
                    label="Generate Form"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        home
                      </Icon>
                    }
                  />
                  <Tab
                    label="Pengisian Data"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        email
                      </Icon>
                    }
                  />
                </Tabs>
              </AppBar>
            </Grid>
            <br></br>
            {renderForm()}
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

export default StokOpname;

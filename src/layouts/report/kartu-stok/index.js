// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PrintAbleKartuStok from "./PrintAbleKartuStok";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Data
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MDButton from "components/MDButton";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { navigateAndClearTokenKepalaGudang } from "navigationUtils/navigationUtilsKepalaGudang";
import { jwtDecode } from "jwt-decode";

function KartuStok() {
  //   state
  const [barang, setBarang] = useState([]);
  const [barangId, setBarangId] = useState(null);
  const [barangNama, setBarangNama] = useState(null);
  const [datePickerAwal, setdatePickerAwal] = useState(null);
  const [datePickerAkhir, setdatePickerAkhir] = useState(null);
  const [kartuStok, setKartuStok] = useState([]);
  const [gudangs, setGudangs] = useState([]);
  const [GudangPick, setGudangPick] = useState(null);
  const [stokAwal, setStokAwal] = useState(0);

  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return <Navigate to="/authentication/sign-in" />;
  }

  const decodedToken = jwtDecode(accessToken);
  if (decodedToken.role_id == 1) {
    localStorage.removeItem("access_token");
    return <Navigate to="/authentication/sign-in" />;
  }

  //   Pemanggilan API
  const getBarang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/barang", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setBarang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Barang :", error);
    }
  };

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

  useEffect(() => {
    getBarang();
    getGudang();
  }, []);

  // const navigate = useNavigate();
  // useEffect(() => {
  //   navigateAndClearTokenKepalaGudang(navigate);
  // }, [navigate]);

  //   function
  const handleChange = async (newValue) => {
    if (newValue) {
      setBarangId(newValue.barang_id);
      setBarangNama(newValue.barang_nama);
    } else {
      setBarangId(null);
      setBarangNama(null);
      console.log("tidak ada new values");
    }
  };

  const handleSubmit = async () => {
    // console.log(datePickerAwal);
    try {
      let response;
      if (GudangPick == null) {
        response = await axios.get(
          `http://127.0.0.1:8000/api/report/get-kartu-stok/${barangId}/${datePickerAwal}/${datePickerAkhir}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } else {
        response = await axios.get(
          `http://127.0.0.1:8000/api/report/get-kartu-stok/${barangId}/${datePickerAwal}/${datePickerAkhir}/${GudangPick}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }

      setKartuStok(response.data.data);
      // setStokAwal(response.data.data_sebelumnya);
      if (response.data.data_sebelumnya != null) {
        setStokAwal(response.data.data_sebelumnya["logbarang_stoksekarang"]);
      } else {
        setStokAwal[0];
      }

      // console.log("ini data sebelumnya : ", response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data kartu Stok:", error);
    }
  };

  const handlePrint = () => {
    // console.log(headerKeluar);
    const printableContent = document.getElementById("printable-content");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <body>${printableContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  const columns = [
    { Header: "Tanggal Transaksi", accessor: "created_at", align: "center" },
    { Header: "Batch Barang", accessor: "detail_barang.detailbarang_batch", align: "center" },
    { Header: "Barang Masuk", accessor: "logbarang_masuk", align: "center" },
    { Header: "Barang Keluar", accessor: "logbarang_keluar", align: "center" },
    { Header: "Stok Tersedia", accessor: "logbarang_stoksekarang", align: "center" },
    { Header: "Jenis Transaksi", accessor: "jenistransaksi", align: "center" },
    { Header: "Keterangan", accessor: "logbarang_keterangan", align: "left" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = kartuStok.map((item) => ({
    created_at: item.created_at ? format(new Date(item.created_at), "dd-MM-yyyy") : "-",
    detail_barang: { detailbarang_batch: item.detail_barang?.detailbarang_batch },
    logbarang_masuk: item.logbarang_masuk ? item.logbarang_masuk : "-",
    logbarang_keluar: item.logbarang_keluar ? item.logbarang_keluar : "-",
    logbarang_stoksekarang: item.logbarang_stoksekarang,
    logbarang_keterangan: item.logbarang_keterangan,
    jenistransaksi:
      item.hkeluar_id !== null
        ? "Barang Keluar"
        : item.hmasuk_id !== null
        ? "Barang Masuk"
        : item.htransfer_barang_id !== null
        ? "Transfer internal"
        : item.hpenyesuaian_id !== null
        ? "Penyesuaian Barang"
        : item.hbarangrusak_id !== null
        ? "Barang rusak"
        : item.hpemusnahan_id !== null
        ? "Pemusnahan Barang"
        : "Belum ada",
    action: (
      <Link to={`/detailbarang-masuk/${item.hmasuk_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Detail
        </MDTypography>
      </Link>
    ),
  }));

  // Handle Excel
  const handleDownload = (data) => {
    const formattedData = data.map((item, index) => ({
      "Tanggal Transaksi": dayjs(item.created_at).format("DD-MM-YYYY"),
      "Batch Barang": item.detail_barang.detailbarang_batch,
      "Barang Masuk": item.logbarang_masuk || "-",
      "Barang Keluar": item.logbarang_keluar || "-",
      "Jumlah Stok Sekarang": item.logbarang_stoksekarang,
      Keterangan: item.logbarang_keterangan,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const wscols = formattedData[0]
      ? Object.keys(formattedData[0]).map((key) => ({ wch: key.length }))
      : [];
    worksheet["!cols"] = wscols;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kartu Stok");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer]),
      `${barangNama}/${datePickerAwal}/${datePickerAkhir}/stokawal-${stokAwal}.xlsx`
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <div id="printable-content" style={{ display: "none" }}>
                <PrintAbleKartuStok
                  kartuStok={kartuStok}
                  stokAwal={stokAwal}
                  datePickerAwal={datePickerAwal}
                  datePickerAkhir={datePickerAkhir}
                />
              </div>
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
                  Table Kartu Stok
                </MDTypography>
              </MDBox>
              {/* <Grid container> */}
              {decodedToken.role_id === 3 ? (
                <Grid container>
                  <Grid item xs={6} pt={4} px={2}>
                    {Array.isArray(barang) && barang.length > 0 ? (
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={barang}
                        getOptionLabel={(option) => `${option.barang_nama}`}
                        onChange={(event, newValue) => {
                          //   setGudangPick(newValue.gudang_id);
                          handleChange(newValue);
                        }}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Pilih Barang " />}
                      />
                    ) : (
                      <p>Loading customer data...</p>
                    )}
                  </Grid>
                  <Grid item xs={6} pt={4} px={2}>
                    {Array.isArray(gudangs) && gudangs.length > 0 ? (
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={gudangs}
                        value={gudangs.find((gudang) => gudang.gudang_id === GudangPick) || null}
                        getOptionLabel={(option) =>
                          `${option.gudang_nama} (${
                            option.jenis_gudang.jenis_gudang_nama || "gamuncul"
                          })`
                        }
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Pilih Gudang" />}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setGudangPick(newValue.gudang_id);
                          } else {
                            setGudangPick(null);
                          }
                        }}
                      />
                    ) : (
                      <p>Loading customer data...</p>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  <Grid item xs={12} pt={4} px={2}>
                    {Array.isArray(barang) && barang.length > 0 ? (
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={barang}
                        getOptionLabel={(option) => `${option.barang_nama}`}
                        onChange={(event, newValue) => {
                          //   setGudangPick(newValue.gudang_id);
                          handleChange(newValue);
                        }}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Pilih Barang " />}
                      />
                    ) : (
                      <p>Loading customer data...</p>
                    )}
                  </Grid>
                </Grid>
              )}
              {/* </Grid> */}
              <Grid container>
                <Grid item xs={6} pt={4} px={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      fullWidth
                      sx={{ width: "100%" }}
                      value={datePickerAwal}
                      onChange={(newValue) => {
                        // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                        const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                        setdatePickerAwal(formattedDate);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6} pt={4} px={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      fullWidth
                      sx={{ width: "100%" }}
                      value={datePickerAkhir}
                      onChange={(newValue) => {
                        // Menggunakan format dayjs untuk mengonversi ke "YYYY-MM-DD"
                        const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : "";
                        setdatePickerAkhir(formattedDate);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid item xs={12} px={2} pb={3} pt={5}>
                <MDButton variant="gradient" color="success" fullWidth onClick={handleSubmit}>
                  Tampilkan
                </MDButton>
              </Grid>
              <Grid item xs={12} px={2} pb={3} pt={5}>
                <MDTypography>Stok Awal : {stokAwal ?? 0}</MDTypography>
              </Grid>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch
                />
                {kartuStok.length > 0 && (
                  <Grid item xs={12} px={2} pb={3} pt={5}>
                    <MDButton
                      variant="gradient"
                      color="success"
                      onClick={handlePrint}
                      sx={{ marginRight: "8px" }}
                    >
                      Print
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={() => handleDownload(kartuStok)}
                    >
                      Download Excel
                    </MDButton>
                  </Grid>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default KartuStok;

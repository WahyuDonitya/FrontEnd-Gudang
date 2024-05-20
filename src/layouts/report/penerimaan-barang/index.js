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
// import PrintAbleKartuStok from "./PrintAbleKartuStok";

// Data
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MDButton from "components/MDButton";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import { jwtDecode } from "jwt-decode";

function PenerimaanBarang() {
  //   state
  const [datePickerAwal, setdatePickerAwal] = useState(null);
  const [datePickerAkhir, setdatePickerAkhir] = useState(null);
  const [laporanPenerimaan, setLaporanPenerimaan] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);
  const [gudangs, setGudangs] = useState([]);
  const [GudangPick, setGudangPick] = useState(null);

  const accessToken = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(accessToken);

  // if (!accessToken) {
  //   return <Navigate to="/authentication/sign-in" />;
  // }

  // const decodedToken = jwtDecode(accessToken);
  // if (decodedToken.role_id == 3) {
  //   localStorage.removeItem("access_token");
  //   return <Navigate to="/authentication/sign-in" />;
  // }

  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigateAndClearTokenUser(navigate);
  // }, [navigate]);

  //   Pemanggilan API

  const handleSubmit = async () => {
    // console.log(datePickerAwal);
    try {
      let response;
      if (GudangPick == null) {
        response = await axios.get(
          `http://127.0.0.1:8000/api/report/get-report-penerimaan/${datePickerAwal}/${datePickerAkhir}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } else {
        response = await axios.get(
          `http://127.0.0.1:8000/api/report/get-report-penerimaan/${datePickerAwal}/${datePickerAkhir}/${GudangPick}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }

      //   console.log(response.data.datahbarang);

      setLaporanPenerimaan(response.data);
      setDataBarang(response.data.datahbarang);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data kartu Stok:", error);
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
    getGudang();
  }, []);

  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     const hasToken = !!localStorage.getItem("access_token");
  //     if (!hasToken) {
  //       navigate("/authentication/sign-in");
  //     }
  //   }, [navigate]);

  //   function

  const columns = [
    { Header: "No. ", accessor: "nomor", align: "center" },
    { Header: "Nota Masuk ", accessor: "hmasuk_nota", align: "center" },
    { Header: "Nota Supplier", accessor: "hmasuk_notasupplier", align: "center" },
    { Header: "Pengguna Generate ", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    {
      Header: "Pengguna Keputusan ",
      accessor: "pengguna_action.pengguna_nama",
      align: "center",
    },
    { Header: "Status ", accessor: "status", align: "center" },
    { Header: "Detail Barang ", accessor: "detail", align: "center" },
  ];

  const rows = dataBarang.map((item, index) => ({
    nomor: index + 1,
    hmasuk_nota: item.hmasuk_nota,
    hmasuk_notasupplier: item.hmasuk_notasupplier,
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_username || "-" },
    pengguna_action: { pengguna_nama: item.pengguna_action.pengguna_username || "-" },
    status:
      item.hmasuk_status == 0
        ? "Ditolak"
        : item.hmasuk_status == 1
        ? "Distujui"
        : item.hmasuk_status == 2
        ? "Menunggu Approval"
        : "",
    detail: (
      <Link to={`/penerimaan-barang/${item.hmasuk_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Detail
        </MDTypography>
      </Link>
    ),
  }));

  const handleDownload = (data) => {
    const formattedData = data.map((item, index) => ({
      "Nota Masuk": item.hmasuk_nota,
      "Nota Supplier": item.hmasuk_notasupplier,
      "Pengguna Generate": item.pengguna_generate.pengguna_nama || "-",
      "Pengguna Action": item.pengguna_action.pengguna_nama || "-",
      Status:
        item.hmasuk_status == 1
          ? "Disetujui"
          : item.hmasuk_status == 2
          ? "Menunggu Persetujuan"
          : "Ditolak",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const wscols = formattedData[0]
      ? Object.keys(formattedData[0]).map((key) => ({ wch: key.length }))
      : [];
    worksheet["!cols"] = wscols;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kartu Stok");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), `penerimaanbarang/${datePickerAwal}/${datePickerAkhir}.xlsx`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* <div id="printable-content" style={{ display: "none" }}>
                <PrintAbleKartuStok kartuStok={kartuStok} />
              </div> */}
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
                  Laporan Penerimaan Barang
                </MDTypography>
              </MDBox>
              {decodedToken.role_id === 3 ? (
                <Grid container>
                  <Grid item xs={12} pt={4} px={2}>
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
                            // getBarangWithGudang(newValue);
                          } else {
                            setGudangPick(null);
                            // setBarang([]);
                          }
                        }}
                      />
                    ) : (
                      <p>Loading customer data...</p>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
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
              <Grid container spacing={7} mt={1} ml={1}>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color="dark"
                      icon="weekend"
                      title="Jumlah nota Approved"
                      count={laporanPenerimaan.barangditerima}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Just updated",
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      icon="leaderboard"
                      title="Jumlah nota Rejected"
                      count={laporanPenerimaan.barangditolak}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Just updated",
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color="warning"
                      icon="store"
                      title="Jumlah nota need approval"
                      count={laporanPenerimaan.menungguapprove}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Just updated",
                      }}
                    />
                  </MDBox>
                </Grid>
              </Grid>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  canSearch
                  noEndBorder
                />
                {/* <Grid item xs={12} px={2} pb={3} pt={5}>
                  <MDButton variant="gradient" color="success" onClick={handleSubmit}>
                    Print
                  </MDButton>
                </Grid> */}
                {dataBarang.length > 0 && (
                  <Grid item xs={12} px={2} pb={3} pt={5}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      onClick={() => handleDownload(dataBarang)}
                    >
                      Download Excel
                    </MDButton>
                  </Grid>
                )}
              </MDBox>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
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
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default PenerimaanBarang;

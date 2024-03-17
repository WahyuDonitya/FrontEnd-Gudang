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
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";

function PengirimanBarang() {
  //   state
  const [barang, setBarang] = useState([]);
  const [datePickerAwal, setdatePickerAwal] = useState(null);
  const [datePickerAkhir, setdatePickerAkhir] = useState(null);
  const [laporanPengiriman, setLaporanPengiriman] = useState([]);

  const accessToken = localStorage.getItem("access_token");

  //   Pemanggilan API
  const getBarang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/report/inventory-aging", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setBarang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Barang :", error);
    }
  };

  const handleSubmit = async () => {
    // console.log(datePickerAwal);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/report/get-report-pengiriman-barang/${datePickerAwal}/${datePickerAkhir}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setLaporanPengiriman(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data kartu Stok:", error);
    }
  };

  useEffect(() => {
    getBarang();
  }, []);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const hasToken = !!localStorage.getItem("access_token");
  //   if (!hasToken) {
  //     navigate("/authentication/sign-in");
  //   }
  // }, [navigate]);

  //   function

  //   const handlePrint = () => {
  //     // console.log(headerKeluar);
  //     const printableContent = document.getElementById("printable-content");

  //     const printWindow = window.open("", "_blank");
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>Print</title>
  //         </head>
  //         <body>${printableContent.innerHTML}</body>
  //       </html>
  //     `);
  //     printWindow.document.close();
  //     printWindow.print();
  //     printWindow.onafterprint = () => printWindow.close();
  //   };

  const columns = [
    { Header: "No. ", accessor: "nomor", align: "center" },
    { Header: "Nama Customer ", accessor: "customer", align: "center" },
    { Header: "Jumlah Pengiriman ", accessor: "pengiriman", align: "center" },
    { Header: "Detail ", accessor: "detail", align: "center" },
  ];

  const rows = laporanPengiriman.map((item, index) => ({
    nomor: index + 1,
    customer: item.customer.customer_nama,
    pengiriman: item.jumlah_surat_jalan,
    detail: (
      <Link
        to={`/detail-report-pengiriman-barang/${item.customer_id}/${datePickerAwal}/${datePickerAkhir}`}
      >
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Detail
        </MDTypography>
      </Link>
    ),
  }));

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
                  Laporan Pengiriman Barang
                </MDTypography>
              </MDBox>
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

export default PengirimanBarang;

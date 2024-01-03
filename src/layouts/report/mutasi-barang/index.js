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
import { Link } from "react-router-dom";
import { format } from "date-fns";

function PergerakanBarang() {
  //   state
  const [barang, setBarang] = useState([]);
  const [barangId, setBarangId] = useState(null);
  const [datePickerAwal, setdatePickerAwal] = useState(null);
  const [datePickerAkhir, setdatePickerAkhir] = useState(null);
  const [kartuStok, setKartuStok] = useState([]);

  const accessToken = localStorage.getItem("access_token");

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

  useEffect(() => {
    getBarang();
  }, []);

  //   function
  const handleChange = async (newValue) => {
    if (newValue) {
      setBarangId(newValue.barang_id);
    } else {
      console.log("tidak ada new values");
    }
  };

  const handleSubmit = async () => {
    try {
      let response = null;
      if (datePickerAkhir != null) {
        response = await axios.get(
          `http://127.0.0.1:8000/api/report/get-pergerakan-barang/${barangId}/${datePickerAwal}/${datePickerAkhir}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } else {
        response = await axios.get(
          `http://127.0.0.1:8000/api/report/get-pergerakan-barang/${barangId}/${datePickerAwal}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
      setKartuStok(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data kartu Stok:", error);
    }
  };

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
    { Header: "No. Nota Keluar", accessor: "hkeluar_nota", align: "center" },
    { Header: "No. Nota Masuk", accessor: "hmasuk_nota", align: "center" },
    { Header: "No. Nota Supplier", accessor: "hmasuk_notasupplier", align: "center" },
    { Header: "No. Nota Transfer", accessor: "htransfer_barang_nota", align: "center" },
    { Header: "Nama Supplier", accessor: "supplier.supplier_name", align: "center" },
    { Header: "Nama Customer", accessor: "customer.customer_nama", align: "center" },
    { Header: "Catatan", accessor: "hmasuk_comment", align: "center" },
    { Header: "Tanggal dibuat", accessor: "created_at", align: "center" },
    { Header: "Jenis Transaksi", accessor: "jenistransaksi", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = kartuStok.map((item) => ({
    hkeluar_nota: item.hkeluar_nota ? item.hkeluar_nota : "-",
    hmasuk_nota: item.hmasuk_nota ? item.hmasuk_nota : "-",
    hmasuk_notasupplier: item.hmasuk_notasupplier ? item.hmasuk_notasupplier : "-",
    htransfer_barang_nota: item.htransfer_barang_nota ? item.htransfer_barang_nota : "-",
    supplier: { supplier_name: item.supplier?.supplier_name },
    customer: { customer_nama: item.customer?.customer_nama },
    hmasuk_comment: item.hmasuk_comment ? item.hmasuk_comment : "-",
    created_at: item.created_at ? format(new Date(item.created_at), "dd-MM-yyyy") : "-",
    jenistransaksi: item.hmasuk_id
      ? "Barang Masuk"
      : item.hkeluar_id
      ? "Barang Keluar"
      : item.htransfer_barang_id
      ? "Transfer Internal"
      : "Belum ada",
    action: (
      <Link
        to={
          item.hmasuk_id
            ? `/detailbarang-masuk/${item.hmasuk_nota}`
            : item.hkeluar_id
            ? `/detail/${item.hkeluar_nota}`
            : item.htransfer_barang_id
            ? `/detailmutasi-barang/${item.htransfer_barang_id}`
            : ""
        }
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
                  Table Pergerakan Barang
                </MDTypography>
              </MDBox>
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
                  noEndBorder
                />
                <Grid item xs={12} px={2} pb={3} pt={5}>
                  <MDButton variant="gradient" color="success" onClick={handleSubmit}>
                    Print
                  </MDButton>
                </Grid>
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

export default PergerakanBarang;

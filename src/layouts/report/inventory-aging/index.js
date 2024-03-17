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

function InventoryAging() {
  //   state
  const [barang, setBarang] = useState([]);

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

  useEffect(() => {
    getBarang();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

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
    { Header: "Nama Barang ", accessor: "barang_nama", align: "center" },
    { Header: "Batch Barang ", accessor: "detailbarang_batch", align: "center" },
    { Header: "Stok Barang ", accessor: "detailbarang_stok", align: "center" },
    { Header: "Lama Di Gudang", accessor: "umur_inventaris", align: "center" },
  ];

  const rows = barang.map((item, index) => ({
    nomor: index + 1,
    barang_nama: item.barang_nama,
    detailbarang_batch: item.detailbarang_batch,
    detailbarang_stok: item.detailbarang_stok,
    umur_inventaris: `${item.umur_inventaris} Hari`,
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
                  Inventory Aging
                </MDTypography>
              </MDBox>
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

export default InventoryAging;

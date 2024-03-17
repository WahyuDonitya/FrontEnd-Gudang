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
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

function DetailReportPengirimanBarang() {
  //   state

  const [laporanPengiriman, setLaporanPengiriman] = useState([]);
  const { dataId, dateAwal, dateAkhir } = useParams();

  const accessToken = localStorage.getItem("access_token");

  //   Pemanggilan API
  const getBarang = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/report/get-report-detail-pengiriman-barang/${dataId}/${dateAwal}/${dateAkhir}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLaporanPengiriman(response.data);
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

  const columns = [
    { Header: "No. ", accessor: "nomor", align: "center" },
    { Header: "Nota Barang Keluar ", accessor: "customer", align: "center" },
    { Header: "Jumlah Pengiriman ", accessor: "pengiriman", align: "center" },
    { Header: "List Surat Jalan ", accessor: "list_jalan", align: "center" },
  ];

  const rows = laporanPengiriman.map((item, index) => ({
    nomor: index + 1,
    customer: item.hkeluar_nota,
    pengiriman: item.jumlah_surat_jalan,
    list_jalan: (
      <Link to={`/list-suratjalan-by-hkeluar/${item.hkeluar_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Show
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

export default DetailReportPengirimanBarang;

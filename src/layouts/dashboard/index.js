// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const accessToken = localStorage.getItem("access_token");
  const [countHkeluar, setCountHkeluar] = useState(0);
  const [countSuratJalan, setCountSuratJalan] = useState(0);
  const [countBarangMasuk, setCountBarangMasuk] = useState(0);
  const [countMutasiBarang, setMutasiBarang] = useState(0);

  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.role_id == 3) {
      localStorage.removeItem("access_token");
      window.location.href = "/authentication/sign-in";
    }
  } else {
    window.location.href = "/authentication/sign-in";
  }

  // api
  const getCountHkeluar = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/transaksi-barang/get-count-hkeluar-approval`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCountHkeluar(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const getCountSuratJalan = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/suratjalan/suratjalan-needapproval-count",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setCountSuratJalan(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data surat jalan :", error);
    }
  };

  const getCountBarangMasuk = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/detailbarang/get-count-barang-masuk",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCountBarangMasuk(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data barang masuk :", error);
    }
  };

  const getCountMutasiBarang = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/detailbarang/get-count-mutasi-barang-approval",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const currentDate = new Date().toDateString();
      setMutasiBarang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data mutasi barang :", error);
    }
  };

  useEffect(() => {
    getCountHkeluar();
    getCountSuratJalan();
    getCountBarangMasuk();
    getCountMutasiBarang();
  }, []);
  // end api

  // code dibawah untuk melakukan pengecekan token

  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigateAndClearTokenUser(navigate);
  // }, [navigate]);

  // const { sales, tasks } = reportsLineChartData;
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Jumlah proses approval barang keluar"
                count={countHkeluar}
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
                title="Jumlah proses approval surat jalan"
                count={countSuratJalan}
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
                color="success"
                icon="store"
                title="Jumlah proses approval barang masuk"
                count={countBarangMasuk}
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
                color="primary"
                icon="person_add"
                title="Jumlah proses approval mutasi barang"
                count={countMutasiBarang}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/* <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;

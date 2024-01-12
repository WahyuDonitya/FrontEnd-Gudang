/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "layouts/barang-keluar/components/Header";

function Dashboard() {
  const accessToken = localStorage.getItem("access_token");
  const [countHkeluar, setCountHkeluar] = useState(0);
  const [countSuratJalan, setCountSuratJalan] = useState(0);
  const [countBarangMasuk, setCountBarangMasuk] = useState(0);
  const [countMutasiBarang, setMutasiBarang] = useState(0);
  // api
  const getCountHkeluar = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/transaksi-barang/get-count-hkeluar-approval`,
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
        "http://127.0.0.1:8000/api/suratjalan/suratjalan-needapproval-count",
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
        "http://127.0.0.1:8000/api/detailbarang/get-count-barang-masuk",
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
        "http://127.0.0.1:8000/api/detailbarang/get-count-mutasi-barang-approval",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

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
                title="Jumlah approval barang keluar"
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
                title="Jumlah approval surat jalan"
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
                title="Jumlah approval barang masuk"
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
                title="Jumlah approval mutasi barang"
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

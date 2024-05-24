// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MDBadge from "components/MDBadge";
import { DatePicker } from "@mui/x-date-pickers";
import MDButton from "components/MDButton";
import { TextField } from "@mui/material";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { jwtDecode } from "jwt-decode";

// Data
// import listpemusnahan from "./data";
// import rejectedSJ from "./data/listRejectSuratJalan";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function ListBarangRusak() {
  const [dataHrusak, setHrusak] = useState([]);
  const [filteredDataHrusak, setFilteredDataHrusak] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  let decodedToken;
  if (accessToken) {
    decodedToken = jwtDecode(accessToken);
    if (decodedToken.role_id == 3) {
      localStorage.removeItem("access_token");
      window.location.href = "/authentication/sign-in";
    }
  } else {
    window.location.href = "/authentication/sign-in";
  }

  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: "pusher",
    key: "683ba5d4db6280a1434b",
    cluster: "ap1",
    forceTLS: true,
  });

  useEffect(() => {
    echo.channel("gudang-real-time").listen(".RealTimeBarangRusak", (event) => {
      console.log("Real-time event received:", event);
      setHrusak((prevList) => [event.data, ...prevList]);
      setFilteredDataHrusak((prevList) => [event.data, ...prevList]);
    });

    return () => {
      echo.leaveChannel("gudang-real-time");
    };
  }, []);

  // API
  const getHbarangRusak = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/barang-rusak/get-hbarang-rusak`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setHrusak(response.data);
      setFilteredDataHrusak(response.data);
    } catch (error) {
      console.log("terjadi kesalahan saat mengambil data barang rusak ", error);
    }
  };

  const handleDetailClick = async (id) => {
    try {
      if (decodedToken.role_id == 2) {
        const response = await axios.post(
          `https://api.tahupoosby.com/api/barang-rusak/update-sudah-dilihat`,
          { hbarangrusak_id: id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } catch (error) {
      console.log("Terjadi Kesalahan Saat melakukan update ".error);
    }
  };
  // End API

  useEffect(() => {
    getHbarangRusak();
  }, []);

  const handleFilterByDate = () => {
    if (!startDate || !endDate) return;

    const filteredData = dataHrusak.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setFilteredDataHrusak(filteredData);
  };

  useEffect(() => {
    handleFilterByDate();
  }, [startDate, endDate]);

  const handleClick = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredDataHrusak(dataHrusak);
  };

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nota Barang Rusak", accessor: "nota", align: "center" },
    { Header: "Pengguna Generate", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Kronologi", accessor: "kronologi", align: "center" },
    { Header: "Penanggung Jawab", accessor: "pelaku", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "Detail", accessor: "detail", align: "center" },
  ];

  const rows = filteredDataHrusak.map((item, index) => {
    return {
      index: index + 1,
      nota: item.hbarangrusak_nota,
      pengguna_generate: { pengguna_nama: item.pengguna_generate.pengguna_nama },
      kronologi: item.hbarangrusak_kronologi,
      pelaku: item.hbarangrusak_pelaku,
      status:
        item.hbarangrusak_status == 0 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Belum Dilihat" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ) : item.hbarangrusak_status == 1 ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Sudah Dilihat" color="success" variant="gradient" size="sm" />
          </MDBox>
        ) : (
          "-"
        ),
      detail: (
        <Link to={`/list-barang-rusak/${item.hbarangrusak_nota}`}>
          <MDTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={() => handleDetailClick(item.hbarangrusak_id)}
          >
            Detail
          </MDTypography>
        </Link>
      ),
    };
  });
  //   const { columns, rows } = listpemusnahan();
  //   const { columnsreject, rowsreject } = rejectedSJ();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                  List Pemusnahan Barang
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", justifyContent: "flex-end" }} mr={2}>
                <DatePicker
                  label="Tanggal Mulai"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ marginRight: 2 }}
                />
                <DatePicker
                  label="Tanggal Akhir"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ marginRight: 2 }}
                />
                <MDButton variant="gradient" color="info" onClick={handleClick}>
                  Reset
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListBarangRusak;

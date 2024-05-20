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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import listpemusnahan from "./data";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MDBadge from "components/MDBadge";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import MDButton from "components/MDButton";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { jwtDecode } from "jwt-decode";
// import rejectedSJ from "./data/listRejectSuratJalan";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function ListPemusnahanBarang() {
  // const { columns, rows } = listpemusnahan();
  const [pemusnahanlist, setPemusnahanList] = useState([]);
  const [filteredpemusnahanlist, setFilteredpemusnahanlist] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
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
    echo.channel("gudang-real-time").listen(".RealTimePemusnahanBarang", (event) => {
      console.log("Real-time event received:", event);
      setPemusnahanList((prevList) => [event.data, ...prevList]);
      setFilteredpemusnahanlist((prevList) => [event.data, ...prevList]);
    });

    return () => {
      echo.leaveChannel("gudang-real-time");
    };
  }, []);

  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/pemusnahan-barang/get-all-pemusnahan-barang",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setPemusnahanList(response.data);
      setFilteredpemusnahanlist(response.data);
      //   console.log(approvalList);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  useEffect(() => {
    getApprovalList();
  }, []);

  const handleFilterByDate = () => {
    if (!startDate || !endDate) return;

    const filteredData = pemusnahanlist.filter((item) => {
      const itemDate = new Date(item.hpemusnahan_tanggal);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setFilteredpemusnahanlist(filteredData);
  };

  useEffect(() => {
    handleFilterByDate();
  }, [startDate, endDate]);

  const handleClick = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredpemusnahanlist(pemusnahanlist);
  };

  const columns = [
    { Header: "No. Nota", accessor: "hpemusnahan_nota", width: "12%", align: "left" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Pemberi Keputusan", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "Catatan", accessor: "hpemusnahan_catatan", align: "center" },
    { Header: "Tanggal Pemusnahan", accessor: "hpemusnahan_tanggal", align: "center" },
    { Header: "Status", accessor: "hpemusnahan_status", align: "center" },
    { Header: "Comment", accessor: "hpemusnahan_rejectreason", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
    //   { Header: "Print Surat Jalan", accessor: "action_print", align: "center" },
  ];

  const rows = filteredpemusnahanlist.map((item) => ({
    hpemusnahan_nota: item.hpemusnahan_nota,
    pengguna_generate: { pengguna_nama: item.pengguna_generate.pengguna_nama },
    pengguna_action: { pengguna_nama: item.pengguna_generate.pengguna_nama },
    hpemusnahan_catatan: item.hpemusnahan_catatan || "-",
    hpemusnahan_tanggal: dayjs(item.hpemusnahan_tanggal).format("DD-MM-YYYY"),
    hpemusnahan_status:
      item.hpemusnahan_status === 0 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.hpemusnahan_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Disetujui" color="success" variant="gradient" size="sm" />
        </MDBox>
      ) : item.hpemusnahan_status === 2 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Ditolak" color="warning" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Sudah Dimusnahkan" color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
    hpemusnahan_rejectreason: item.hpemusnahan_rejectreason || "-",
    // gudang: {
    //   gudang_nama: item.h_keluar.gudang.gudang_nama,
    // },
    //   suratjalan_tanggalkirim: item.suratjalan_tanggalkirim,
    action: (
      <Link to={`/list-pemusnahan-barang/${item.hpemusnahan_nota}`}>
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

export default ListPemusnahanBarang;

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

// Data
import MDBadge from "components/MDBadge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import MDButton from "components/MDButton";
import { TextField } from "@mui/material";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { jwtDecode } from "jwt-decode";

function ListBarangMasuk() {
  const [approvalList, setApprovalList] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const [filteredApprovalList, setFilteredApprovalList] = useState([]);
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
    echo.channel("gudang-real-time").listen(".RealTimeBarangMasuk", (event) => {
      console.log("Real-time event received:", event);
      setApprovalList((prevList) => [event.data, ...prevList]);
      setFilteredApprovalList((prevList) => [event.data, ...prevList]);
    });

    return () => {
      echo.leaveChannel("gudang-real-time");
    };
  }, []);

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/detailbarang/get-hbarang-masuk-all",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setApprovalList(response.data);
      setFilteredApprovalList(response.data);
      console.log(approvalList);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };
  //    End API

  useEffect(() => {
    getApprovalList();
  }, []);

  const handleFilterByDate = () => {
    if (!startDate || !endDate) return;

    const filteredData = approvalList.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setFilteredApprovalList(filteredData);
  };

  useEffect(() => {
    handleFilterByDate();
  }, [startDate, endDate]);

  const handleClick = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredApprovalList(approvalList);
  };

  const columns = [
    { Header: "No. Nota", accessor: "hmasuk_nota", width: "12%", align: "left" },
    { Header: "No. Nota Supplier", accessor: "hmasuk_notasupplier", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Pemberi Keputusan", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "Comment", accessor: "hmasuk_comment", align: "center" },
    { Header: "Dibuat tanggal", accessor: "tanggal", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = filteredApprovalList.map((item, index) => ({
    hmasuk_nota: item.hmasuk_nota,
    tanggal: dayjs(item.created_at).format("DD-MM-YYYY"),
    hmasuk_notasupplier: item.hmasuk_notasupplier,
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
    pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
    hmasuk_comment: item.hmasuk_comment || "-",
    status:
      item.hmasuk_status === 2 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.hmasuk_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Disetujui" color="success" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Ditolak" color="warning" variant="gradient" size="sm" />
        </MDBox>
      ),
    action: (
      <Link to={`/list-barang-masuk/${item.hmasuk_nota}`}>
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
                  List Barang Masuk
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
                  key={rows.length}
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  canSearch
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListBarangMasuk;

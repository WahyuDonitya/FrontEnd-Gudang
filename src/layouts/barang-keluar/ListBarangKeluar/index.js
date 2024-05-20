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
import { Link } from "react-router-dom";
import MDBadge from "components/MDBadge";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import MDButton from "components/MDButton";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { jwtDecode } from "jwt-decode";

function ListBarangKeluar() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);
  const [filteredApprovalList, setFilteredApprovalList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.role_id == 3) {
      console.log("tes");
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
    echo.channel("gudang-real-time").listen(".RealTimeBarangKeluar", (event) => {
      console.log("Real-time event received:", event);
      setApprovalList((prevList) => [event.data, ...prevList]);
      setFilteredApprovalList((prevList) => [event.data, ...prevList]);
    });

    return () => {
      echo.leaveChannel("gudang-real-time");
    };
  }, []);

  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/transaksi-barang/getAll-hkeluar",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setApprovalList(response.data);
      setFilteredApprovalList(response.data);
      // console.log(approvalList);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  useEffect(() => {
    getApprovalList();
  }, []);

  const handleFilterByDate = () => {
    if (!startDate || !endDate) return;

    const filteredData = approvalList.filter((item) => {
      const itemDate = new Date(item.hkeluar_tanggal);
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
    { Header: "No. Nota", accessor: "hkeluar_nota", width: "10%", align: "left" },
    { Header: "Nama Customer", accessor: "customer.customer_nama", align: "center" },
    { Header: "Gudang", accessor: "gudang.gudang_nama", align: "center" },
    { Header: "Tanggal Keluar", accessor: "hkeluar_tanggal", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "Comment", accessor: "hkeluar_comment", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
    { Header: "List surat jalan", accessor: "list_jalan", align: "center" },
  ];

  const rows = filteredApprovalList.map((item) => ({
    hkeluar_nota: item.hkeluar_nota,
    customer: { customer_nama: item.customer?.customer_nama },
    gudang: { gudang_nama: item.gudang?.gudang_nama },
    hkeluar_tanggal: dayjs(item.hkeluar_tanggal).format("DD-MM-YYYY"),
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
    pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
    hkeluar_comment: item.hkeluar_comment || "-",
    status:
      item.hkeluar_status === 0 ? (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent="Sudah Dibuatkan Surat Jalan"
            color="success"
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ) : item.hkeluar_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent="Dibuatkan Surat Jalan sebagian"
            color="info"
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ) : item.hkeluar_status === 2 ? (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent="Belum Dibuatkan Surat Jalan"
            color="info"
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ) : item.hkeluar_status === 3 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.hkeluar_status === 5 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Rusak Semua" color="error" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Ditolak" color="warning" variant="gradient" size="sm" />
        </MDBox>
      ),
    action: (
      <Link to={`/list-barang-keluar/${item.hkeluar_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.hkeluar_status === 2 ? "Print" : "Detail"}
        </MDTypography>
      </Link>
    ),
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
                  List Barang Keluar
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

export default ListBarangKeluar;

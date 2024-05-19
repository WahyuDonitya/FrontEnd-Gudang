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
import listdataMutasi from "./data/listDataMutasiBarang";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MDBadge from "components/MDBadge";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import MDButton from "components/MDButton";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

function ListMutasiBarang() {
  // const { columns, rows } = listdataMutasi();
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);
  const [filteredApprovalList, setFilteredApprovalList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: "pusher",
    key: "683ba5d4db6280a1434b",
    cluster: "ap1",
    forceTLS: true,
  });

  useEffect(() => {
    echo.channel("gudang-real-time").listen(".RealTimeMutasiBarang", (event) => {
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
        "http://127.0.0.1:8000/api/gudang/get-transaksi/get-all-mutasi-barang",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
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
      const itemDate = new Date(item.htransfer_barang_tanggal_dikirim);
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
    { Header: "No. Nota", accessor: "htransfer_barang_nota", width: "12%", align: "left" },
    { Header: "Gudang Asal", accessor: "gudang_asal.gudang_nama", align: "center" },
    { Header: "Gudang Tujuan", accessor: "gudang_tujuan.gudang_nama", align: "center" },
    { Header: "Tanggal Kirim", accessor: "htransfer_barang_tanggal_dikirim", align: "center" },
    { Header: "Catatan Transfer", accessor: "htransfer_barang_catatan", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "Comment", accessor: "htransfer_comment", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
    { Header: "List Surat Jalan", accessor: "list", align: "center" },
  ];

  const rows = filteredApprovalList.map((item) => ({
    htransfer_barang_nota: item.htransfer_barang_nota,
    gudang_asal: { gudang_nama: item.gudang_asal.gudang_nama },
    gudang_tujuan: { gudang_nama: item.gudang_tujuan.gudang_nama },
    htransfer_barang_tanggal_dikirim: dayjs(item.htransfer_barang_tanggal_dikirim).format(
      "DD-MM-YYYY"
    ),
    htransfer_comment: item.htransfer_comment || "-",
    htransfer_barang_catatan: item.htransfer_barang_catatan,
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
    pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
    status:
      item.htransfer_barang_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.htransfer_barang_status === 2 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Disetujui" color="success" variant="gradient" size="sm" />
        </MDBox>
      ) : item.htransfer_barang_status === 3 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Ditolak" color="warning" variant="gradient" size="sm" />
        </MDBox>
      ) : item.htransfer_barang_status === 4 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Terkirim Sebagian" color="success" variant="gradient" size="sm" />
        </MDBox>
      ) : item.htransfer_barang_status === 5 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Rusak Semua" color="error" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Terkirim" color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
    action: (
      <Link to={`/detailmutasi-barang/${item.htransfer_barang_id}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Detail
        </MDTypography>
      </Link>
    ),
    list: (
      <Link to={`/list-suratjalan-by-htransfer/${item.htransfer_barang_nota}`}>
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
                  List Mutasi Barang
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
                  noEndBorder
                  canSearch
                />
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

export default ListMutasiBarang;

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
import dataListSj from "./data/listDataSuratJalan";
import dataListSjTrans from "./data/listDataSuratJalanTrans";
import MDBadge from "components/MDBadge";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import MDButton from "components/MDButton";

function ListSuratJalan() {
  // const { columns, rows } = dataListSj();
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);
  const [approvalList2, setApprovalList2] = useState([]);
  const [filteredApprovalList, setFilteredApprovalList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredApprovalList2, setFilteredApprovalList2] = useState([]);
  const [startDate2, setStartDate2] = useState(null);
  const [endDate2, setEndDate2] = useState(null);
  // const { columns2, rows2 } = dataListSjTrans();

  //    API
  const getApprovalList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/suratjalan/get-surat-jalan-all", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setApprovalList(response.data);
      setFilteredApprovalList(response.data);
      // console.log(approvalList);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const getApprovalList2 = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/suratjalan/get-surat-jalan-transfer-all",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setApprovalList2(response.data);
      setFilteredApprovalList2(response.data);
      // console.log("ini approval ", approvalList);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };
  //    End API

  useEffect(() => {
    getApprovalList();
    getApprovalList2();
  }, []);

  const handleFilterByDate = () => {
    if (!startDate || !endDate) return;

    const filteredData = approvalList.filter((item) => {
      const itemDate = new Date(item.suratjalan_tanggalkirim);
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

  const handleFilterByDate2 = () => {
    if (!startDate2 || !endDate2) return;

    const filteredData = approvalList2.filter((item) => {
      const itemDate = new Date(item.suratjalantransfer_tanggalkirim);
      return itemDate >= startDate2 && itemDate <= endDate2;
    });

    setFilteredApprovalList2(filteredData);
  };

  useEffect(() => {
    handleFilterByDate2();
  }, [startDate2, endDate2]);

  const handleClick2 = () => {
    setStartDate2(null);
    setEndDate2(null);
    setFilteredApprovalList2(approvalList2);
  };

  const columns = [
    { Header: "No. Surat Jalan", accessor: "suratjalan_nota", width: "12%", align: "left" },
    { Header: "No. Nota", accessor: "h_keluar.hkeluar_nota", align: "center" },
    { Header: "Customer", accessor: "customer.customer_nama", align: "center" },
    { Header: "Customer Alamat", accessor: "customer.customer_alamat", align: "center" },
    { Header: "Dari Gudang", accessor: "gudang.gudang_nama", align: "center" },
    { Header: "Tanggal Kirim", accessor: "suratjalan_tanggalkirim", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "pengirim", accessor: "pengirim", align: "center" },
    { Header: "Comment", accessor: "suratjalan_comment", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = filteredApprovalList.map((item) => ({
    suratjalan_nota: item.suratjalan_nota,
    h_keluar: { hkeluar_nota: item.h_keluar?.hkeluar_nota },
    customer: {
      customer_nama: item.h_keluar?.customer?.customer_nama,
      customer_alamat: item.h_keluar?.customer?.customer_alamat,
    },
    gudang: {
      gudang_nama: item.h_keluar?.gudang?.gudang_nama,
    },
    suratjalan_tanggalkirim: dayjs(item.suratjalan_tanggalkirim).format("DD-MM-YYYY"),
    suratjalan_comment: item.suratjalan_comment || "-",
    pengirim: item.suratjalan_pengirim || "-",
    status:
      item.suratjalan_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Dtiolak" color="error" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalan_status === 2 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalan_status === 3 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Menunggu Pengiriman" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalan_status === 4 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Proses Pengiriman" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalan_status === 5 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Rusak" color="error" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Terkirim" color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
    pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
    action: (
      <Link to={`/detailsurat-jalan/${item.suratjalan_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.suratjalan_status === 3 ? "Print" : "Detail"}
        </MDTypography>
      </Link>
    ),
  }));

  const columns2 = [
    {
      Header: "No. Surat Jalan",
      accessor: "suratjalantransfer_nota",
      width: "12%",
      align: "left",
    },
    { Header: "No. Nota", accessor: "htransfer.htransfer_barang_nota", align: "center" },
    { Header: "Gudang Asal", accessor: "htransfer.gudang_asal.gudang_nama", align: "center" },
    { Header: "Gudang Tujuan", accessor: "htransfer.gudang_tujuan.gudang_nama", align: "center" },
    { Header: "Tanggal Kirim", accessor: "suratjalantransfer_tanggalkirim", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "Pengirim", accessor: "pengirim", align: "center" },
    { Header: "Comment", accessor: "suratjalantransfer_comment", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows2 = filteredApprovalList2.map((item) => ({
    suratjalantransfer_nota: item.suratjalantransfer_nota,
    htransfer: {
      htransfer_barang_nota: item.htransfer?.htransfer_barang_nota,
      gudang_asal: { gudang_nama: item.htransfer?.gudang_asal?.gudang_nama },
      gudang_tujuan: { gudang_nama: item.htransfer?.gudang_tujuan?.gudang_nama },
    },
    suratjalantransfer_comment: item.suratjalantransfer_comment || "-",
    suratjalantransfer_tanggalkirim: dayjs(item.suratjalantransfer_tanggalkirim).format(
      "DD-MM-YYYY"
    ),
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
    pengguna_action: { pengguna_nama: item.pengguna_action?.pengguna_nama || "-" },
    pengirim: item.suratjalantransfer_pengirim || "-",
    status:
      item.suratjalantransfer_status === 0 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Terkirim" color="success" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalantransfer_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Ditolak" color="danger" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalantransfer_status === 2 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Menunggu Approval" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalantransfer_status === 4 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Proses Pengiriman" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : item.suratjalantransfer_status === 5 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Rusak" color="error" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Proses Pengiriman" color="info" variant="gradient" size="sm" />
        </MDBox>
      ),
    action: (
      <Link to={`/detailsurat-jalan/transferbarang/${item.suratjalantransfer_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.suratjalantransfer_status === 3 ? "Print" : "Detail"}
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
                  List Surat Jalan
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
                  List surat jalan transfer
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", justifyContent: "flex-end" }} mr={2}>
                <DatePicker
                  label="Tanggal Mulai"
                  value={startDate2}
                  onChange={(newValue) => setStartDate2(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ marginRight: 2 }}
                />
                <DatePicker
                  label="Tanggal Akhir"
                  value={endDate2}
                  onChange={(newValue) => setEndDate2(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ marginRight: 2 }}
                />
                <MDButton variant="gradient" color="info" onClick={handleClick2}>
                  Reset
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: columns2, rows: rows2 }}
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

export default ListSuratJalan;

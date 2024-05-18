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

function ListPermintaanBarang() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);
  const [filteredApprovalList, setFilteredApprovalList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const getApprovalList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/permintaan/get-permintaan", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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

  const handleClickDetail = async (newValue) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/permintaan/update-dilihat`,
        {
          nomornota: newValue,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Berhasil");
    } catch (error) {
      console.log("terdapat error ", error);
    }
  };

  const columns = [
    { Header: "No. Nota", accessor: "hpermintaan_nota", width: "10%", align: "left" },
    { Header: "Gudang", accessor: "gudang.gudang_nama", align: "center" },
    { Header: "Tanggal Pembuatan", accessor: "created_at", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = filteredApprovalList.map((item) => ({
    hpermintaan_nota: item.hpermintaan_nota,
    gudang: { gudang_nama: item.gudang?.gudang_nama },
    created_at: dayjs(item.created_at).format("DD-MM-YYYY"),
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
    status:
      item.hpermintaan_status === 0 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Belum Dilihat" color="warning" variant="gradient" size="sm" />
        </MDBox>
      ) : item.hpermintaan_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Sudah Dilihat" color="success" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        "-"
      ),
    action: (
      <Link to={`/detail-permintaan-barang/${item.hpermintaan_nota}`}>
        <MDTypography
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => handleClickDetail(item.hpermintaan_nota)}
        >
          detail
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
                  List Permintaan Barang
                </MDTypography>
              </MDBox>
              <MDBox pt={3} sx={{ display: "flex", justifyContent: "flex-end" }} mr={2}>
                <DatePicker
                  label="Tanggal Mulai"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  // renderInput={(params) => <TextField {...params} />}
                  sx={{ marginRight: 2 }}
                />
                <DatePicker
                  label="Tanggal Akhir"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  // renderInput={(params) => <TextField {...params} />}
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

export default ListPermintaanBarang;

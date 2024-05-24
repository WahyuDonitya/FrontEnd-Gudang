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

function ListPackaging() {
  const accessToken = localStorage.getItem("access_token");
  const [approvalList, setApprovalList] = useState([]);
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

  //   window.Pusher = Pusher;

  //   const echo = new Echo({
  //     broadcaster: "pusher",
  //     key: "683ba5d4db6280a1434b",
  //     cluster: "ap1",
  //     forceTLS: true,
  //   });

  //   useEffect(() => {
  //     echo.channel("gudang-real-time").listen(".RealTimePermintaanBarang", (event) => {
  //       console.log("Real-time event received:", event);
  //       setApprovalList((prevList) => [event.data, ...prevList]);
  //       setFilteredApprovalList((prevList) => [event.data, ...prevList]);
  //     });

  //     return () => {
  //       echo.leaveChannel("gudang-real-time");
  //     };
  //   }, []);

  // API
  const getApprovalList = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/packaging/get-packaging-barang",
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

  //   const handleClickDetail = async (newValue) => {
  //     try {
  //       const response = await axios.post(
  //         `https://api.tahupoosby.com/api/permintaan/update-dilihat`,
  //         {
  //           nomornota: newValue,
  //         },
  //         { headers: { Authorization: `Bearer ${accessToken}` } }
  //       );
  //       console.log("Berhasil");
  //     } catch (error) {
  //       console.log("terdapat error ", error);
  //     }
  //   };

  const columns = [
    { Header: "No. Nota", accessor: "nota", width: "10%", align: "left" },
    { Header: "Penanggung Jawab", accessor: "pelaku", align: "center" },
    { Header: "Tanggal Pembuatan", accessor: "created_at", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = filteredApprovalList.map((item) => ({
    nota: item.hpackaging_nota,
    pelaku: item.hpackaging_penanggungjawab,
    created_at: dayjs(item.created_at).format("DD-MM-YYYY"),
    pengguna_generate: { pengguna_nama: item.pengguna_generate?.pengguna_nama || "-" },
    status:
      item.hpackaging_status === 1 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Belum Berjalan" color="warning" variant="gradient" size="sm" />
        </MDBox>
      ) : item.hpackaging_status === 2 ? (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Sedang Berjalan" color="info" variant="gradient" size="sm" />
        </MDBox>
      ) : (
        <MDBox ml={-1}>
          <MDBadge badgeContent="Selesai" color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
    action: (
      <Link to={`/detail-packaging/${item.hpackaging_nota}`}>
        <MDTypography
          variant="caption"
          color="text"
          fontWeight="medium"
          //   onClick={() => handleClickDetail(item.hpermintaan_nota)}
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
                  List Packaging Barang
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

export default ListPackaging;

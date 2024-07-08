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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MDBadge from "components/MDBadge";

function ListSuratJalanByHkeluar() {
  const accessToken = localStorage.getItem("access_token");
  const { dataId } = useParams();

  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/suratjalan/get-suratjalan-by-hkeluar/${dataId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Terjadi kesalahan saat pengambilan data surat jalan : ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

  const columns = [
    { Header: "No. Surat Jalan", accessor: "suratjalan_nota", width: "12%", align: "left" },
    { Header: "Customer Alamat", accessor: "customer.customer_alamat", align: "center" },
    { Header: "Tanggal Kirim", accessor: "suratjalan_tanggalkirim", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Pembuat", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Diputus Oleh", accessor: "pengguna_action.pengguna_nama", align: "center" },
    { Header: "Comment", accessor: "suratjalan_comment", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = data.map((item) => ({
    suratjalan_nota: item.suratjalan_nota,
    h_keluar: { hkeluar_nota: item.h_keluar?.hkeluar_nota },
    customer: {
      customer_alamat: item.h_keluar?.customer?.customer_alamat,
    },
    gudang: {
      gudang_nama: item.h_keluar?.gudang?.gudang_nama,
    },
    suratjalan_tanggalkirim: item.suratjalan_tanggalkirim,
    suratjalan_comment: item.suratjalan_comment || "-",
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
      <Link to={`/list-surat-jalan/${item.suratjalan_nota}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.suratjalan_status === 3 ? "Print" : "Detail"}
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

export default ListSuratJalanByHkeluar;

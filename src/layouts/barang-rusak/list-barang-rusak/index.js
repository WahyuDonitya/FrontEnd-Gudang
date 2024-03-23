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

// Data
// import listpemusnahan from "./data";
// import rejectedSJ from "./data/listRejectSuratJalan";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function ListBarangRusak() {
  const [dataHrusak, setHrusak] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  // API
  const getHbarangRusak = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/barang-rusak/get-hbarang-rusak`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setHrusak(response.data);
    } catch (error) {
      console.log("terjadi kesalahan saat mengambil data barang rusak ", error);
    }
  };

  const handleDetailClick = async (id) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/barang-rusak/update-sudah-dilihat`,
        { hbarangrusak_id: id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (error) {
      console.log("Terjadi Kesalahan Saat melakukan update ".error);
    }
  };
  // End API

  useEffect(() => {
    getHbarangRusak();
  }, []);

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nota Barang Rusak", accessor: "nota", align: "center" },
    { Header: "Pengguna Generate", accessor: "pengguna_generate.pengguna_nama", align: "center" },
    { Header: "Kronologi", accessor: "kronologi", align: "center" },
    { Header: "Penanggung Jawab", accessor: "pelaku", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "Detail", accessor: "detail", align: "center" },
  ];

  const rows = dataHrusak.map((item, index) => {
    return {
      index: index + 1,
      nota: item.hbarangrusak_nota,
      pengguna_generate: { pengguna_nama: item.pengguna_generate.pengguna_nama },
      kronologi: item.hbarangrusak_kronologi,
      pelaku: item.hbarangrusak_pelaku,
      status:
        item.hbarangrusak_status == 0
          ? "Belum Dilihat"
          : item.hbarangrusak_status == 1
          ? "Sudah Dilihat"
          : "-",
      detail: (
        <Link to={`/detail-list-barang-rusak/${item.hbarangrusak_nota}`}>
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

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
import { Link, useParams } from "react-router-dom";
import { Button, Modal } from "@mui/material";

// Data
// import listpemusnahan from "./data";
// import rejectedSJ from "./data/listRejectSuratJalan";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailPermintaanBarang() {
  const accessToken = localStorage.getItem("access_token");
  const [data, setData] = useState([]);
  const { dataId } = useParams();

  // End popup gambar

  // API
  const getDPermintaan = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/permintaan/get-detail-permintaan/${dataId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setData(response.data);
    } catch (error) {
      console.log("terjadi kesalahan saat mengambil data barang rusak ", error);
    }
  };
  // End API

  useEffect(() => {
    getDPermintaan();
  }, []);

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang", accessor: "barang", align: "center" },
    { Header: "Jumlah Barang", accessor: "jumlah", align: "center" },
  ];

  const rows = data.map((item, index) => {
    return {
      index: index + 1,
      barang: item.barang.barang_nama,
      jumlah: item.dpermintaan_jumlah,
    };
  });

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
                  Detail Permintaan Barang
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

export default DetailPermintaanBarang;

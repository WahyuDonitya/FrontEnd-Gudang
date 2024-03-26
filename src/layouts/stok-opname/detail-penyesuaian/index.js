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

function DetailPenyesuaian() {
  const [dataPenyesuaian, setDataPenyesuaian] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const { dataId } = useParams();

  // API
  const getDbarangRusak = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/stok-opname/get-penyesuaian/${dataId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setDataPenyesuaian(response.data);
    } catch (error) {
      console.log("terjadi kesalahan saat mengambil data barang rusak ", error);
    }
  };
  // End API

  useEffect(() => {
    getDbarangRusak();
  }, []);

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang", accessor: "barang", align: "center" },
    { Header: "Batch Barang", accessor: "batch", align: "center" },
    { Header: "Tempat Barang", accessor: "tempat", align: "center" },
    { Header: "Jumlah Tercatat", accessor: "tercatat", align: "center" },
    { Header: "Jumlah Aktual", accessor: "aktual", align: "center" },
    { Header: "Jumlah Difference", accessor: "difference", align: "center" },
    { Header: "Catatan", accessor: "catatan", align: "center" },
  ];

  const rows = dataPenyesuaian.map((item, index) => {
    return {
      index: index + 1,
      barang: item.detail_barang?.barang?.barang_nama || "-",
      batch: item.detail_barang?.detailbarang_batch || "-",
      tempat: item.penempatan_produk?.get_rack?.get_rows?.row_name
        ? `Rows ${item.penempatan_produk.get_rack.get_rows.row_name}, Sel ${item.penempatan_produk.get_rack.rack_bay}, Level ${item.penempatan_produk.get_rack.rack_level}`
        : "Dari Bulk",
      tercatat: item.detailbarangopname_jumlahditempat,
      aktual: item.detailbarangopname_jumlahaktual,
      difference: item.detailbarangopname_jumlahdifference,
      catatan: item.detailbarangopname_catatan,
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
                  Detail Penyesuaian Barang
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

export default DetailPenyesuaian;

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
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Data
// import ListBarangMasukData from "./data/ListBarangMasukData";
// import { useNavigate } from "react-router-dom";
// import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
// import { useEffect } from "react";

function DetailBarangByGudang() {
  const { dataId } = useParams();
  const [stok, setStok] = useState([]);
  const accessToken = localStorage.getItem("access_token");

  //   API
  const getStok = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/detailbarang/get-detail-barang-stok-by-gudangid/${dataId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setStok(response.data);
      //   console.log(dataId);
    } catch (error) {
      console.log("error saat mengambil data stok");
    }
  };
  // END API

  useEffect(() => {
    getStok();
  }, []);

  const columns = [
    {
      Header: "Nama Barang",
      accessor: "barang.barang_nama",
      width: "12%",
      align: "left",
    },
    { Header: "Jumlah Stok", accessor: "total_stok", align: "center" },
    { Header: "Detail", accessor: "detail", align: "center" },
  ];

  const rows = stok.map((item) => ({
    barang: { barang_nama: item.barang.barang_nama },
    total_stok: item.total_stok,
    detail: (
      <Link to={`/detail-barang/${item.barang.barang_id}/${dataId}`}>
        <MDTypography variant="caption" color="text" fontWeight="medium">
          Detail
        </MDTypography>
      </Link>
    ),
  }));
  //   const { columns, rows } = ListBarangMasukData();

  // const navigate = useNavigate();

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

export default DetailBarangByGudang;

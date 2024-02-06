/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

function DetailBarang() {
  const [detailBarang, setDetailBarang] = useState([]);
  const dataId = useParams();
  const accessToken = localStorage.getItem("access_token");

  // API
  const getDetailBarang = async () => {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/detailbarang/get-detail-by-barang-id/${dataId.dataId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setDetailBarang(response.data);
  };

  // End API

  useEffect(() => {
    getDetailBarang();
  }, []);

  const columns = [
    { Header: "No . ", accessor: "nomor", width: "3%", align: "center" },
    { Header: "Batch Barang", accessor: "detailbarang_batch", align: "center" },
    { Header: "Exp Date", accessor: "detailbarang_expdate", align: "center" },
    { Header: "Jumlah Barang saat datang", accessor: "detailbarang_stokmasuk", align: "center" },
    { Header: "Jumlah Barang", accessor: "detailbarang_stok", align: "center" },
  ];

  const rows = detailBarang.map((item, index) => ({
    nomor: index + 1,
    detailbarang_batch: item.detailbarang_batch,
    detailbarang_expdate: dayjs(item.detailbarang_expdate).format("DD-MM-YYYY"),
    detailbarang_stokmasuk: item.detailbarang_stokmasuk,
    detailbarang_stok: item.detailbarang_stok,
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
                  List Detail Barang
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
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

export default DetailBarang;

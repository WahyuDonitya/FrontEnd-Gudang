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
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import MDBadge from "components/MDBadge";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { SignalCellularNullTwoTone } from "@mui/icons-material";

function ListTempatBarang() {
  const [tempatBarang, setTempatBarang] = useState([]);
  const dataId = useParams();
  const accessToken = localStorage.getItem("access_token");

  // API
  const getTempatBarang = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/positioning/get-position-by-barang/${dataId.dataId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log(res.data);
      setTempatBarang(res.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data tempat barang ", error);
    }
  };
  // End API

  useEffect(() => {
    getTempatBarang();
  }, []);

  const columns = [
    { Header: "No . ", accessor: "nomor", width: "3%", align: "center" },
    { Header: "Lokasi Barang", accessor: "lokasi", align: "center" },
    { Header: "Jumlah Barang", accessor: "penempatanproduk_jumlah", align: "center" },
  ];

  const rows = tempatBarang.map((item, index) => ({
    nomor: index + 1,
    lokasi: `Rows : ${item.get_rack.get_rows.row_name}, Sel : ${item.get_rack.rack_bay}, Level : ${item.get_rack.rack_level} `,
    penempatanproduk_jumlah: item.penempatanproduk_jumlah,
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
                  Lokasi Barang
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
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

export default ListTempatBarang;

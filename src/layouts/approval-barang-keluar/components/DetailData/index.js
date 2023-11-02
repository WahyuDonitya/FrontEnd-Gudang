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
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailData() {
  const [detailKeluar, setDetailKeluar] = useState([]);
  const [headerKeluar, setHeaderlKeluar] = useState([]);
  const { dataId } = useParams();
  const accessToken = localStorage.getItem("access_token");

  // API

  const getId = async () => {
    try {
      const id = await axios.get(
        `http://127.0.0.1:8000/api/transaksi-barang/get-hkeluar-id/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const response = await axios.get(
        `http://127.0.0.1:8000/api/transaksi-barang/get-dkeluar/${id.data.hkeluar_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(id.data);
      setDetailKeluar(response.data);
      setHeaderlKeluar(id.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleApprove = async () => {
    try {
      const datatosend = {
        dataId: dataId,
      };
      // console.log("tes");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transaksi-barang/approve-keluar",
        datatosend,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Terjadi kesalahan saat melakukan approval barang keluar : ", error);
    }
  };

  const handleReject = async () => {
    try {
      const datatosend = {
        dataId: dataId,
      };
      console.log("tes");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transaksi-barang/reject-keluar",
        datatosend,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Terjadi kesalahan saat melakukan reject barang keluar : ", error);
    }
  };

  // END API

  useEffect(() => {
    getId();
  }, []);

  const columns = [
    { Header: "Nama Barang", accessor: "barang", width: "10%", align: "left" },
    { Header: "Batch Barang", accessor: "d_barang", align: "center" },
    { Header: "Jumlah Barang", accessor: "dkeluar_jumlah", align: "center" },
    { Header: "Harga", accessor: "dkeluar_harga", align: "center" },
  ];

  const rows = detailKeluar.map((item) => ({
    barang: item.barang.barang_nama,
    d_barang: item.d_barang.detailbarang_batch,
    dkeluar_jumlah: item.dkeluar_jumlah,
    dkeluar_harga: item.dkeluar_harga !== null ? item.dkeluar_harga : "Tidak ada harga",
  }));

  // console.log("Rows Data:", detailKeluar);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <Grid container mt={4}>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">Nomor Nota : {headerKeluar.hkeluar_nota}</MDTypography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">
                    Tanggal Dibuat : {formatDate(headerKeluar.created_at)}
                  </MDTypography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">
                    Customer : {headerKeluar.customer?.customer_nama}
                  </MDTypography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">
                    Alamat : {headerKeluar.customer?.customer_alamat}
                  </MDTypography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">
                    Rencana kirim tanggal : {headerKeluar.hkeluar_tanggal}
                  </MDTypography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">
                    Dari Gudang : {headerKeluar.gudang?.gudang_nama}
                  </MDTypography>
                </Grid>
              </Grid>
              <Grid container pt={4}>
                <Grid item xs={12}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </Grid>
              </Grid>
              <Grid container pt={5} spacing={7} px={3} mb={4}>
                <Grid item xs={6}>
                  <MDButton variant="gradient" color="error" fullWidth onClick={handleReject}>
                    Reject
                  </MDButton>
                </Grid>
                <Grid item xs={6}>
                  <MDButton variant="gradient" color="success" fullWidth onClick={handleApprove}>
                    Approve
                  </MDButton>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export default DetailData;

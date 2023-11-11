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
import MDSnackbar from "components/MDSnackbar";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailMB() {
  const [detailMutasiBarang, setDetailMutasiBarang] = useState([]);
  const [headerMutasiBarang, setHeaderlMutasiBarang] = useState([]);
  const { dataId } = useParams();

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const [successRejectSB, setSuccessRejectSB] = useState(false);
  const openSuccessRejectSB = () => setSuccessRejectSB(true);
  const closeSuccessRejectSB = () => setSuccessRejectSB(false);

  const [errorRejectSB, setErrorRejectSB] = useState(false);
  const openErrorRejectSB = () => setErrorRejectSB(true);
  const closeErrorRejectSB = () => setErrorRejectSB(false);

  const accessToken = localStorage.getItem("access_token");

  // API

  const getId = async () => {
    try {
      const id = await axios.get(
        `http://127.0.0.1:8000/api/gudang/get-transaksi/get-header-by-id/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const response = await axios.get(
        `http://127.0.0.1:8000/api/gudang/get-transaksi/get-dtrans/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //   console.log(response.data);
      //   console.log(id.data);
      setDetailMutasiBarang(response.data);
      setHeaderlMutasiBarang(id.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleApprove = async () => {
    try {
      const datatosend = {
        dataId: dataId,
      };
      console.log(datatosend);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/suratjalan/suratjalan-approval",
        datatosend,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      openSuccessSB();
      console.log(response);
    } catch (error) {
      openErrorSB();
      console.error("Terjadi kesalahan saat melakukan approval surat jalan : ", error);
    }
  };

  const handleReject = async () => {
    try {
      const datatosend = {
        dataId: dataId,
      };
      console.log(datatosend);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/suratjalan/suratjalan-reject",
        datatosend,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      openSuccessRejectSB();
      console.log(response);
    } catch (error) {
      openErrorRejectSB();
      console.error(
        "Terjadi kesalahan saat melakukan reject barang keluar : ",
        error.response.data
      );
    }
  };

  // END API

  useEffect(() => {
    getId();
  }, []);

  const columns = [
    { Header: "Nama Barang", accessor: "barang.barang_nama", width: "10%", align: "left" },
    { Header: "Batch Barang", accessor: "barang_detail.detailbarang_batch", align: "center" },
    { Header: "Jumlah Dikirim", accessor: "dtransfer_barang_jumlah", align: "center" },
  ];

  const rows = detailMutasiBarang.map((item) => ({
    barang: { barang_nama: item?.barang?.barang_nama || "N/A" },
    barang_detail: {
      detailbarang_batch: item?.barang_detail?.detailbarang_batch || "N/A",
    },
    dtransfer_barang_jumlah: item.dtransfer_barang_jumlah,
  }));

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil Melakukan approve Surat Jalan"
      dateTime="Baru Saja"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Notifikasi Error"
      content="Error Melakukan approve Surat Jalan"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const renderRejectSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil Melakukan Reject Surat Jalan"
      dateTime="Baru Saja"
      open={successRejectSB}
      onClose={closeSuccessRejectSB}
      close={closeSuccessRejectSB}
      bgWhite
    />
  );

  const renderRejectErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Notifikasi Error"
      content="Error Melakukan Reject Surat Jalan"
      dateTime="Baru Saja"
      open={errorRejectSB}
      onClose={closeErrorRejectSB}
      close={closeErrorRejectSB}
      bgWhite
    />
  );
  // console.log("Rows Data:", detailKeluar);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
              {headerMutasiBarang.htransfer_barang_status === 1 && (
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
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={6}>
          {renderSuccessSB}
          {renderErrorSB}
          {renderRejectSuccessSB}
          {renderRejectErrorSB}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default DetailMB;

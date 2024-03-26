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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDInput from "components/MDInput";
import PrintableFormBarangKeluar from "./PrintableFormBarangKeluar";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";

// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailData() {
  const [detailKeluar, setDetailKeluar] = useState([]);
  const [headerKeluar, setHeaderlKeluar] = useState([]);
  const { dataId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  let decode = null;
  if (accessToken) {
    decode = jwtDecode(accessToken);
  }

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
  // End state notification

  // Handle modal
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const openRejectModalHandler = () => {
    setOpenRejectModal(true);
  };

  const closeRejectModalHandler = () => {
    setOpenRejectModal(false);
    setRejectReason(""); // Clear reject reason when modal is closed
  };
  // End Handle modal

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
      console.log(response.data);
      setDetailKeluar(response.data);
      setHeaderlKeluar(id.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleApprove = async () => {
    if (window.confirm("Apakah anda yakin ingin melakukan proses Approve?")) {
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
        openSuccessSB();
        getId();
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat melakukan approval barang keluar : ", error);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("Apakah anda yakin ingin melakukan proses Reject?")) {
      if (!rejectReason.trim()) {
        alert("Box Alasan harus diisi");
        return;
      }
      try {
        const datatosend = {
          dataId: dataId,
          hkeluar_comment: rejectReason,
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
        getId();
        closeRejectModalHandler();
        openSuccessRejectSB();
      } catch (error) {
        openErrorRejectSB();
        console.error("Terjadi kesalahan saat melakukan reject barang keluar : ", error);
      }
    }
  };

  const handlePrint = () => {
    // alert(decode.role_id);
    console.log(headerKeluar);
    const printableContent = document.getElementById("printable-content");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <body>${printableContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  // END API

  useEffect(() => {
    getId();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  const columns = [
    { Header: "Nama Barang", accessor: "barang", width: "10%", align: "left" },
    { Header: "Batch Barang", accessor: "d_barang", align: "center" },
    { Header: "Jumlah Barang", accessor: "dkeluar_jumlah", align: "center" },
    { Header: "Jumlah Terkirim", accessor: "dkeluar_terkirim", align: "center" },
    { Header: "Jumlah Sisa", accessor: "dkeluar_sisa", align: "center" },
    { Header: "Proses Approve", accessor: "dkeluar_needapprovekirim", align: "center" },
    { Header: "Harga", accessor: "dkeluar_harga", align: "center" },
  ];

  const rows = detailKeluar.map((item) => ({
    barang: item.barang.barang_nama,
    d_barang: item.d_barang.detailbarang_batch,
    dkeluar_jumlah: item.dkeluar_jumlah,
    dkeluar_terkirim: item.dkeluar_terkirim,
    dkeluar_sisa: item.dkeluar_sisa,
    dkeluar_needapprovekirim: item.dkeluar_needapprovekirim,
    dkeluar_harga: item.dkeluar_harga !== null ? item.dkeluar_harga : "Tidak ada harga",
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
              <div id="printable-content" style={{ display: "none" }}>
                <PrintableFormBarangKeluar
                  detailKeluar={detailKeluar}
                  headerKeluar={headerKeluar}
                />
              </div>
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
              {headerKeluar.hkeluar_status === 3 && decode.role_id === 2 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={6}>
                    <MDButton
                      variant="gradient"
                      color="error"
                      fullWidth
                      onClick={openRejectModalHandler}
                    >
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

              {headerKeluar.hkeluar_status !== 3 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                      Print Nota
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
      <Dialog open={openRejectModal} onClose={closeRejectModalHandler}>
        <DialogTitle>Reason for Rejection</DialogTitle>
        <DialogContent>
          <MDInput
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Enter reason for rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MDButton color="error" onClick={closeRejectModalHandler}>
            Cancel
          </MDButton>
          <MDButton color="success" onClick={handleReject}>
            Reject
          </MDButton>
        </DialogActions>
      </Dialog>
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

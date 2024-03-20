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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import PrintableFormSJTrans from "./PrintableFormSJTrans";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDInput from "components/MDInput";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailSJTrans() {
  const [detailSuratJalan, setDetailSuratJalan] = useState([]);
  const [headerSuratJalan, setHeaderlSuratJalan] = useState([]);
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

  // end state untuk notification

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

  const accessToken = localStorage.getItem("access_token");
  let decode = null;
  if (accessToken) {
    decode = jwtDecode(accessToken);
  }

  // API

  const getId = async () => {
    try {
      const id = await axios.get(`http://127.0.0.1:8000/api/suratjalan/get-sj-transfer/${dataId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await axios.get(
        `http://127.0.0.1:8000/api/suratjalan/get-dsj-transfer/${id.data.suratjalantransfer_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log("Response : ", id.data);
      setDetailSuratJalan(response.data);
      setHeaderlSuratJalan(id.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleApprove = async () => {
    if (window.confirm("Apakah yakin ingin melakukan approve terhadap surat jalan?")) {
      try {
        const datatosend = {
          dataId: JSON.stringify(headerSuratJalan.suratjalantransfer_id),
        };
        console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/suratjalan/suratjalan-transfer-approval",
          datatosend,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        openSuccessSB();
        console.log(response);
        getId();
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat melakukan approval surat jalan : ", error);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("apakah yakin ingin melakukan reject?")) {
      if (!rejectReason.trim()) {
        alert("Box Alasan harus diisi");
        return;
      }
      try {
        const datatosend = {
          dataId: JSON.stringify(headerSuratJalan.suratjalantransfer_id),
          suratjalantransfer_comment: rejectReason,
        };
        console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/suratjalan/suratjalan-transfer-reject",
          datatosend,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        closeRejectModalHandler();
        openSuccessRejectSB();
        console.log(response);
        getId();
      } catch (error) {
        openErrorRejectSB();
        console.error(
          "Terjadi kesalahan saat melakukan reject barang keluar : ",
          error.response.data
        );
      }
    }
  };

  const handlePrint = async () => {
    console.log(headerSuratJalan.suratjalantransfer_nota);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/suratjalan/kirim-suratjalan-transfer`,
        {
          suratjalantransfer_nota: headerSuratJalan.suratjalantransfer_nota,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
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
      getId();
    } catch (error) {
      console.log("terdapat kesalahan saat mengirim surat jalan");
    }
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
    {
      Header: "Nama Barang",
      accessor: "detail_barang_transfer.barang.barang_nama",
      width: "10%",
      align: "left",
    },
    {
      Header: "Batch Barang",
      accessor: "detail_barang_transfer.barang_detail.detailbarang_batch",
      align: "center",
    },
    { Header: "Jumlah Dikirim", accessor: "dsuratjalantransfer_jumlah", align: "center" },
    {
      Header: "Jumlah Barang",
      accessor: "detail_barang_transfer.dtransfer_barang_jumlah",
      align: "center",
    },
  ];

  const rows = detailSuratJalan.map((item) => ({
    detail_barang_transfer: {
      barang: { barang_nama: item.detail_barang_transfer.barang.barang_nama },
      barang_detail: {
        detailbarang_batch: item.detail_barang_transfer.barang_detail.detailbarang_batch,
      },
      dtransfer_barang_jumlah: item.detail_barang_transfer.dtransfer_barang_jumlah,
    },
    dsuratjalantransfer_jumlah: item.dsuratjalantransfer_jumlah,
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
                {/* Include PrintableForm component */}
                <PrintableFormSJTrans
                  detailSuratJalan={detailSuratJalan}
                  headerSuratJalan={headerSuratJalan}
                />
              </div>
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
              {headerSuratJalan.suratjalantransfer_status === 2 && decode.role_id === 2 && (
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

              {headerSuratJalan.suratjalantransfer_status !== 2 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                      {headerSuratJalan.suratjalantransfer_status === 0
                        ? "Print Nota"
                        : "Kirim dan Print Nota"}
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

export default DetailSJTrans;

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
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDInput from "components/MDInput";
import PrintableFormMutasiBarang from "./PrintableFormMutasiBarang";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailMB() {
  const [detailMutasiBarang, setDetailMutasiBarang] = useState([]);
  const [headerMutasiBarang, setHeaderlMutasiBarang] = useState([]);
  const { dataId } = useParams();

  // state untuk notification
  const [successSBRusak, setSuccessSBRusak] = useState(false);
  const openSuccessRusakSB = () => setSuccessSB(true);
  const closeSuccessRusakSB = () => setSuccessSB(false);

  const [errorSBRusak, setErrorSBRusak] = useState(false);
  const openErrorRusakSB = () => setErrorSB(true);
  const closeErrorRusakSB = () => setErrorSB(false);

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

  const [isInputInvalid, setIsInputInvalid] = useState({});
  const [jumlahRusakByItem, setJumlahRusakByItem] = useState({});
  // End Notification state

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
  const decode = jwtDecode(accessToken);

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

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
    if (window.confirm("apakah anda yakin ingin melakukan approval?")) {
      try {
        const datatosend = {
          dataId: dataId,
        };
        console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/gudang/transaksi-accept",
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
    if (window.confirm("apakah anda yakin ingin melakukan reject?")) {
      if (!rejectReason.trim()) {
        alert("Box Alasan harus diisi");
        return;
      }
      try {
        const datatosend = {
          dataId: dataId,
          htransfer_comment: rejectReason,
        };
        console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/gudang/transaksi-reject",
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

  const handleChangeJumlahKirim = (itemId, newValue) => {
    const currentItem = detailMutasiBarang.find((item) => item.dtransfer_barang_id === itemId);

    // Create a copy of the existing isInputInvalid state
    const updatedIsInputInvalid = { ...isInputInvalid };

    // Update the validity for the current item
    if (newValue > currentItem.dtransfer_barang_jumlah_belum_terkirim) {
      updatedIsInputInvalid[itemId] = true;
    } else {
      updatedIsInputInvalid[itemId] = false;
    }

    setIsInputInvalid(updatedIsInputInvalid);

    if (!updatedIsInputInvalid[itemId]) {
      setJumlahRusakByItem((prev) => ({
        ...prev,
        [itemId]: parseInt(newValue),
      }));
    }
  };

  const handleBarangRusak = async () => {
    if (window.confirm("Apakah data rusak yang anda masukkan sudah benar?")) {
      try {
        const selectedBarang = detailMutasiBarang
          .filter((item) => jumlahRusakByItem[item.dtransfer_barang_id] > 0)
          .map((item) => ({
            dtransfer_barang_id: item.dtransfer_barang_id,
            jumlah_rusak: jumlahRusakByItem[item.dtransfer_barang_id],
          }));
        if (selectedBarang.length === 0) {
          alert("Barang rusak tidak ada yang diisi");
          return;
        }

        const hasInvalidInput = Object.values(isInputInvalid).some((value) => value === true);

        if (hasInvalidInput) {
          alert("Ada input yang tidak valid. Silakan periksa kembali sebelum melanjutkan.");
          return;
        }

        const datatosend = {
          htransfer_barang_nota: headerMutasiBarang.htransfer_barang_nota,
          dtransfer_barangrusak: selectedBarang,
        };

        console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/gudang/pelaporan-barang-rusak",
          datatosend,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log("hasil response : ", response);
        setJumlahRusakByItem({});
        setIsInputInvalid({});
        getId();
        openSuccessRusakSB();
      } catch (error) {
        openErrorRusakSB();
        console.log("Terjadi kesalahan saat melakukan barang rusak : ", error);
      }
    }
  };

  const handlePrint = () => {
    // console.log(headerKeluar);
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

  const columns = [
    { Header: "Nama Barang", accessor: "barang.barang_nama", width: "10%", align: "center" },
    { Header: "Exp. Barang", accessor: "barang_detail.detailbarang_expdate", align: "center" },
    { Header: "Batch Barang", accessor: "barang_detail.detailbarang_batch", align: "center" },
    { Header: "Jumlah", accessor: "dtransfer_barang_jumlah", align: "center" },
    { Header: "Jumlah Terkirim", accessor: "jumlah_terkirim", align: "center" },
    { Header: "Jumlah Belum Terkirim", accessor: "jumlah_belumterkirim", align: "center" },
    { Header: "Jumlah barang rusak", accessor: "jumlahbarangrusak", align: "center" },
    { Header: "Jumlah rusak", accessor: "jumlah_rusak", align: "center" },
  ];

  const rows = detailMutasiBarang.map((item) => ({
    barang: { barang_nama: item?.barang?.barang_nama || "N/A" },
    barang_detail: {
      detailbarang_expdate:
        dayjs(item?.barang_detail?.detailbarang_expdate).format("DD-MM-YYYY") || "N/A",
      detailbarang_batch: item?.barang_detail?.detailbarang_batch || "N/A",
    },
    dtransfer_barang_jumlah: item.dtransfer_barang_jumlah,
    jumlah_terkirim: item.dtransfer_barang_jumlah_terkirim,
    jumlah_belumterkirim: item.dtransfer_barang_jumlah_belum_terkirim,
    jumlahbarangrusak: item.dtransfer_barang_jumlahrusak,
    jumlah_rusak: (
      <MDInput
        type="number"
        value={jumlahRusakByItem[item.dtransfer_barang_id] || 0}
        inputProps={{ min: 0 }}
        error={isInputInvalid[item.dtransfer_barang_id]}
        helperText={
          isInputInvalid[item.dtransfer_barang_id] ? "Jumlah melebihi stok yang tersedia" : ""
        }
        onChange={(e) => handleChangeJumlahKirim(item.dtransfer_barang_id, e.target.value)}
        sx={{
          "& .MuiInput-root": {
            borderColor: isInputInvalid[item.dtransfer_barang_id] ? "red" : "",
          },
        }}
      ></MDInput>
    ),
  }));

  const renderSuccessSBRusak = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil Melakukan pelaporan barang rusak"
      dateTime="Baru Saja"
      open={successSBRusak}
      onClose={closeSuccessRusakSB}
      close={closeSuccessRusakSB}
      bgWhite
    />
  );

  const renderErrorSBRusak = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Notifikasi Error"
      content="Error Melakukan pelaporan barang rusak"
      dateTime="Baru Saja"
      open={errorSBRusak}
      onClose={closeErrorRusakSB}
      close={closeErrorRusakSB}
      bgWhite
    />
  );

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
                <PrintableFormMutasiBarang
                  detailKeluar={detailMutasiBarang}
                  headerKeluar={headerMutasiBarang}
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
              {headerMutasiBarang.htransfer_barang_status === 1 && decode.role_id === 2 && (
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
              {headerMutasiBarang.htransfer_barang_status !== 1 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  {headerMutasiBarang.htransfer_barang_status !== 0 &&
                    headerMutasiBarang.htransfer_barang_status !== 5 && (
                      <Grid item xs={6}>
                        <MDButton
                          variant="gradient"
                          color="error"
                          fullWidth
                          onClick={handleBarangRusak}
                        >
                          Lapor barang rusak
                        </MDButton>
                      </Grid>
                    )}
                  <Grid item xs={6}>
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
          {renderSuccessSBRusak}
          {renderErrorSBRusak}
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

export default DetailMB;

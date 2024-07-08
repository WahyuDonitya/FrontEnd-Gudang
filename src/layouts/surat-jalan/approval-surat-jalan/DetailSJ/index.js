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
import PrintableformSJ from "./PrintableformSJ";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDInput from "components/MDInput";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailSJ() {
  const [detailSuratJalan, setDetailSuratJalan] = useState([]);
  const [headerSuratJalan, setHeaderlSuratJalan] = useState([]);
  const [jumlahRusakByItem, setJumlahRusakByItem] = useState({});
  const [isInputInvalid, setIsInputInvalid] = useState({});
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

  const [openNamaModal, setOpenNamaModal] = useState(false);
  const [nama, setNama] = useState("");

  const openNamaModalHandler = () => {
    setOpenNamaModal(true);
  };

  const closeNamaModalHandler = () => {
    setOpenNamaModal(false);
    setNama(""); // Clear reject reason when modal is closed
  };
  // End Handle modal

  const accessToken = localStorage.getItem("access_token");
  let decode = null;
  if (accessToken) {
    decode = jwtDecode(accessToken);
  } else {
    window.location.href = "/authentication/sign-in";
  }

  // API

  const getId = async () => {
    try {
      const id = await axios.get(`http://127.0.0.1:8000/api/suratjalan/get-sj-id/${dataId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await axios.get(
        `http://127.0.0.1:8000/api/suratjalan/get-dsj/${id.data.suratjalan_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(response.data);
      setDetailSuratJalan(response.data);
      setHeaderlSuratJalan(id.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleApprove = async () => {
    if (window.confirm("Apakah yakin ingin melakukan Approve Surat jalan?")) {
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
        // console.log(response);`
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
        getId();
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat melakukan approval surat jalan : ", error);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("Apakah yakin ingin melakukan reject surat jalan?")) {
      if (!rejectReason.trim()) {
        alert("Box Alasan harus diisi");
        return;
      }
      try {
        const datatosend = {
          dataId: dataId,
          suratjalan_comment: rejectReason,
        };
        console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/suratjalan/suratjalan-reject",
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
    try {
      if (nama == "") {
        alert("nama harus diisi");
      } else {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/suratjalan/kirim-suratjalan`,
          {
            suratjalan_nota: headerSuratJalan.suratjalan_nota,
            nama_pengirim: nama,
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
        closeNamaModalHandler();
        openSuccessSB();
      }
    } catch (error) {
      openErrorSB();
      console.log("Terdapat kesalahan saat melakukan print dan kirim surat jalan : ", error);
    }
  };

  const handleSelesai = async () => {
    try {
      const selectedBarang = detailSuratJalan
        .filter((item) => jumlahRusakByItem[item.dsuratjalan_id] > 0)
        .map((item) => ({
          dsuratjalan_id: item.dsuratjalan_id,
          jumlah_rusak: jumlahRusakByItem[item.dsuratjalan_id],
        }));

      if (selectedBarang.length === 0) {
        if (window.confirm("apakah tidak ada data yang rusak saat pengiriman")) {
          const response = await axios.post(
            `http://127.0.0.1:8000/api/suratjalan/selesai-suratjalan`,
            {
              suratjalan_nota: headerSuratJalan.suratjalan_nota,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          openSuccessSB();
          getId();
        }
      } else {
        if (window.confirm("apakah barang yang rusak sudah benar?")) {
          const hasInvalidInput = Object.values(isInputInvalid).some((value) => value === true);

          if (hasInvalidInput) {
            alert("Ada input yang tidak valid. Silakan periksa kembali sebelum melanjutkan.");
            return;
          }
          const response = await axios.post(
            `http://127.0.0.1:8000/api/suratjalan/selesai-suratjalan`,
            {
              suratjalan_nota: headerSuratJalan.suratjalan_nota,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const res = await axios.post(
            `http://127.0.0.1:8000/api/suratjalan/surat-jalan-rusak`,
            {
              barang_rusak: selectedBarang,
              dataId: dataId,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          openSuccessSB();
          setJumlahRusakByItem({});
          setIsInputInvalid({});
          getId();
        }
      }
    } catch (error) {
      openErrorSB();
      console.log("Terdapat kesalahan saat melakukan print dan kirim surat jalan : ", error);
    }
  };

  const handleBarangRusak = async () => {
    if (window.confirm("apakah data yang anda masukkan sudah benar?")) {
      try {
        const selectedBarang = detailSuratJalan
          .filter((item) => jumlahRusakByItem[item.dsuratjalan_id] > 0)
          .map((item) => ({
            dsuratjalan_id: item.dsuratjalan_id,
            jumlah_rusak: jumlahRusakByItem[item.dsuratjalan_id],
          }));

        if (selectedBarang.length === 0) {
          alert("Barang rusak tidak ada yang diisi");
          return;
        }

        console.log(selectedBarang);

        const hasInvalidInput = Object.values(isInputInvalid).some((value) => value === true);

        if (hasInvalidInput) {
          alert("Ada input yang tidak valid. Silakan periksa kembali sebelum melanjutkan.");
          return;
        }

        const res = await axios.post(
          `http://127.0.0.1:8000/api/suratjalan/surat-jalan-rusak`,
          {
            barang_rusak: selectedBarang,
            dataId: dataId,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        getId();
        setJumlahRusakByItem({});
        setIsInputInvalid({});
        openSuccessSB();
        console.log(res.data);
      } catch (error) {
        openErrorSB();
        console.error("terdapat error pada saat pelaporan barang rusak ", error);
      }
    }
  };

  const handleChangeJumlahKirim = (itemId, newValue) => {
    const currentItem = detailSuratJalan.find((item) => item.dsuratjalan_id === itemId);

    // Create a copy of the existing isInputInvalid state
    const updatedIsInputInvalid = { ...isInputInvalid };

    // Update the validity for the current item
    if (newValue > currentItem.dsuratjalan_jumlah) {
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

  const handlePrintNota = () => {
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

  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigateAndClearTokenUser(navigate);
  // }, [navigate]);

  const columns = [
    { Header: "Nama Barang", accessor: "barang.barang_nama", width: "10%", align: "left" },
    { Header: "Batch Barang", accessor: "d_barang.detailbarang_batch", align: "center" },
    { Header: "Jumlah Dikirim", accessor: "dsuratjalan_jumlah", align: "center" },
    // { Header: "Jumlah Barang", accessor: "jumlah", align: "center" },
    { Header: "Jumlah Barang Rusak", accessor: "rusak", align: "center" },
    { Header: "Jumlah Terkirim", accessor: "terkirim", align: "center" },
    { Header: "Jumlah rusak", accessor: "jumlah_rusak", align: "center" },
  ];

  const rows = detailSuratJalan.map((item) => ({
    barang: { barang_nama: item.d_keluar.barang.barang_nama },
    d_barang: { detailbarang_batch: item.d_keluar.d_barang.detailbarang_batch },
    dsuratjalan_jumlah: item.dsuratjalan_jumlah,
    // jumlah: item.d_keluar.dkeluar_jumlah,
    rusak: item.dsuratjalan_rusak,
    terkirim: item.dsuratjalan_terkirim,
    jumlah_rusak: (
      <MDInput
        type="number"
        value={jumlahRusakByItem[item.dsuratjalan_id] || 0}
        inputProps={{ min: 0 }}
        error={isInputInvalid[item.dsuratjalan_id]}
        helperText={isInputInvalid[item.dsuratjalan_id] ? "Jumlah melebihi stok yang tersedia" : ""}
        onChange={(e) => handleChangeJumlahKirim(item.dsuratjalan_id, e.target.value)}
        sx={{
          "& .MuiInput-root": { borderColor: isInputInvalid[item.dsuratjalan_id] ? "red" : "" },
        }}
      ></MDInput>
    ),
  }));

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil Melakukan transaksi Surat Jalan"
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
      content="Error Melakukan transaksi Surat Jalan"
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
                <PrintableformSJ
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
              {headerSuratJalan.suratjalan_status === 2 && decode.role_id === 2 && (
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

              {headerSuratJalan.suratjalan_status === 3 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={openNamaModalHandler}
                    >
                      Kirim dan Print Nota
                    </MDButton>
                  </Grid>
                </Grid>
              )}

              {headerSuratJalan.suratjalan_status === 4 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleSelesai}>
                      Selesai
                    </MDButton>
                  </Grid>
                </Grid>
              )}

              {/* {headerSuratJalan.suratjalan_status === 0 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrintNota}>
                      Print nota
                    </MDButton>
                  </Grid>
                </Grid>
              )} */}
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

      <Dialog open={openNamaModal} onClose={closeNamaModalHandler}>
        <DialogTitle>Nama Pengirim</DialogTitle>
        <DialogContent>
          <MDInput
            fullWidth
            rows={4}
            variant="outlined"
            label="Isi Nama pengirim"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MDButton color="error" onClick={closeNamaModalHandler}>
            Cancel
          </MDButton>
          <MDButton color="success" onClick={handlePrint}>
            Kirim
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default DetailSJ;

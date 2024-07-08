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
import dayjs from "dayjs";

// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailData() {
  const [detailKeluar, setDetailKeluar] = useState([]);
  const [headerKeluar, setHeaderlKeluar] = useState([]);
  const { dataId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  // alert(dataId);
  let decode = null;
  if (accessToken) {
    decode = jwtDecode(accessToken);
  }

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
  // End state notification

  // Handle modal
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const openRejectModalHandler = () => {
    setOpenRejectModal(true);
  };
  const navigate = useNavigate();

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
        const selectedBarang = detailKeluar
          .filter((item) => jumlahRusakByItem[item.dkeluar_id] > 0)
          .map((item) => ({
            dkeluar_id: item.dkeluar_id,
            jumlah_approve: jumlahRusakByItem[item.dkeluar_id],
          }));

        const datatosend = {
          dataId: dataId,
          dbarang_keluarapprove: selectedBarang,
        };
        console.log(datatosend);
        // return;
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

  const handleCreateSuratJalan = () => {
    // alert(dataId);
    navigate(`/create-surat-jalan/${dataId}`);
  };

  const handleBarangRusak = async () => {
    if (window.confirm("Apakah data rusak yang anda masukkan sudah benar?")) {
      try {
        const selectedBarang = detailKeluar
          .filter((item) => jumlahRusakByItem[item.dkeluar_id] > 0)
          .map((item) => ({
            dkeluar_id: item.dkeluar_id,
            jumlah_rusak: jumlahRusakByItem[item.dkeluar_id],
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
          hkeluar_nota: headerKeluar.hkeluar_nota,
          dbarang_keluarrusak: selectedBarang,
        };

        console.log(datatosend);

        const response = await axios.post(
          "http://127.0.0.1:8000/api/transaksi-barang/barang-keluar-rusak",
          datatosend,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
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

  const handleChangeJumlahKirim = (itemId, newValue) => {
    const currentItem = detailKeluar.find((item) => item.dkeluar_id === itemId);

    // Create a copy of the existing isInputInvalid state
    const updatedIsInputInvalid = { ...isInputInvalid };

    // Update the validity for the current item
    if (newValue > currentItem.dkeluar_sisa) {
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

  // END API

  useEffect(() => {
    getId();
  }, []);

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  let columns;
  let rows;
  if (headerKeluar.hkeluar_status == 3) {
    columns = [
      { Header: "Nama Barang", accessor: "barang", width: "10%", align: "left" },
      { Header: "Batch Barang", accessor: "d_barang", align: "center" },
      { Header: "Jumlah Barang", accessor: "dkeluar_jumlah", align: "center" },
      { Header: "Jumlah Approve", accessor: "jumlah_rusak", align: "center" },
    ];
    rows = detailKeluar.map((item) => ({
      barang: item.barang.barang_nama,
      d_barang: item.d_barang.detailbarang_batch,
      dkeluar_jumlah: item.dkeluar_jumlah,
      jumlah_rusak: (
        <MDInput
          type="number"
          value={jumlahRusakByItem[item.dkeluar_id] || 0}
          inputProps={{ min: 0 }}
          error={isInputInvalid[item.dkeluar_id]}
          helperText={isInputInvalid[item.dkeluar_id] ? "Jumlah melebihi stok yang tersedia" : ""}
          onChange={(e) => handleChangeJumlahKirim(item.dkeluar_id, e.target.value)}
          sx={{
            "& .MuiInput-root": { borderColor: isInputInvalid[item.dkeluar_id] ? "red" : "" },
          }}
        ></MDInput>
      ),
    }));
  } else {
    columns = [
      { Header: "Nama Barang", accessor: "barang", width: "10%", align: "left" },
      { Header: "Batch Barang", accessor: "d_barang", align: "center" },
      { Header: "Jumlah Barang", accessor: "dkeluar_jumlah", align: "center" },
      { Header: "Jumlah Approve", accessor: "jumlah_approve", align: "center" },
      { Header: "Jumlah Terkirim", accessor: "dkeluar_terkirim", align: "center" },
      {
        Header: "Proses Proses Approve Kirim",
        accessor: "dkeluar_needapprovekirim",
        align: "center",
      },
      { Header: "Jumlah Sisa", accessor: "dkeluar_sisa", align: "center" },
      { Header: "Jumlah Rusak", accessor: "rusak", align: "center" },
      { Header: "Input Rusak", accessor: "jumlah_rusak", align: "center" },
    ];
    rows = detailKeluar.map((item) => ({
      barang: item.barang.barang_nama,
      d_barang: item.d_barang.detailbarang_batch,
      dkeluar_jumlah: item.dkeluar_jumlah,
      jumlah_approve: item.dkeluar_jumlahapprove,
      dkeluar_terkirim: item.dkeluar_terkirim,
      dkeluar_sisa: item.dkeluar_sisa,
      dkeluar_needapprovekirim: item.dkeluar_needapprovekirim,
      rusak: item.dkeluar_rusak,
      // dkeluar_rusak: item.dkeluar_rusak,
      // jumlah_rusak: (
      //   <MDInput
      //     type="number"
      //     value={jumlahRusakByItem[item.dkeluar_id] || 0}
      //     inputProps={{ min: 0 }}
      //     error={isInputInvalid[item.dkeluar_id]}
      //     helperText={isInputInvalid[item.dkeluar_id] ? "Jumlah melebihi stok yang tersedia" : ""}
      //     onChange={(e) => handleChangeJumlahKirim(item.dkeluar_id, e.target.value)}
      //     sx={{ "& .MuiInput-root": { borderColor: isInputInvalid[item.dkeluar_id] ? "red" : "" } }}
      //   ></MDInput>
      // ),
      jumlah_rusak: (
        <MDInput
          type="number"
          value={jumlahRusakByItem[item.dkeluar_id] || 0}
          inputProps={{ min: 0 }}
          error={isInputInvalid[item.dkeluar_id]}
          helperText={isInputInvalid[item.dkeluar_id] ? "Jumlah melebihi stok yang tersedia" : ""}
          onChange={(e) => handleChangeJumlahKirim(item.dkeluar_id, e.target.value)}
          sx={{
            "& .MuiInput-root": { borderColor: isInputInvalid[item.dkeluar_id] ? "red" : "" },
          }}
        ></MDInput>
      ),
    }));
  }

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
      content="Berhasil Melakukan approve Barang keluar"
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
      content="Error Melakukan approve barang keluar"
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
      content="Berhasil Melakukan Reject barang keluar"
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
      content="Error Melakukan Reject barang keluar"
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
                    Tanggal Dibuat : {dayjs(headerKeluar.created_at).format("DD-MM-YYYY")}
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
                    Rencana kirim tanggal :{" "}
                    {dayjs(headerKeluar.hkeluar_tanggal).format("DD-MM-YYYY")}
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
                  <Grid item xs={6}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                      Print Nota
                    </MDButton>
                  </Grid>
                  {headerKeluar.hkeluar_status !== 0 &&
                    headerKeluar.hkeluar_status !== 4 &&
                    headerKeluar.hkeluar_status !== 5 && (
                      <>
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
                        <Grid item xs={12}>
                          <MDButton
                            variant="gradient"
                            color="success"
                            fullWidth
                            onClick={handleCreateSuratJalan}
                          >
                            Buat Surat Jalan
                          </MDButton>
                        </Grid>
                      </>
                    )}
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
          {renderSuccessSBRusak}
          {renderErrorSBRusak}
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

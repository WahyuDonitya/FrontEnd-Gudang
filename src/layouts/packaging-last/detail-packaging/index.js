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
// import PrintableFormBarangKeluar from "./PrintableFormBarangKeluar";
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import dayjs from "dayjs";
import PrintableFormPackaging from "./PrintableFormPackaging";

// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailPackaging() {
  const [detailKeluar, setDetailKeluar] = useState([]);
  const [headerKeluar, setHeaderlKeluar] = useState([]);
  const [dataDetailKeluar, setDataDetailKeluar] = useState([]);
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

  const navigate = useNavigate();

  const closeRejectModalHandler = () => {
    setOpenRejectModal(false);
    setRejectReason(""); // Clear reject reason when modal is closed
  };
  // End Handle modal

  // API

  const getId = async () => {
    try {
      const id = await axios.get(`http://127.0.0.1:8000/api/packaging/get-hpackaging/${dataId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await axios.get(
        `http://127.0.0.1:8000/api/packaging/get-dpackaging/${id.data.hpackaging_id}`,
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
    const currentItem = detailKeluar.find((item) => item.dpackaging_id === itemId);

    // Create a copy of the existing isInputInvalid state
    const updatedIsInputInvalid = { ...isInputInvalid };

    // Update the validity for the current item
    if (newValue > currentItem.dpackaging_jumlah) {
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

  const handleJalankan = async () => {
    try {
      const id = await axios.post(
        `http://127.0.0.1:8000/api/packaging/update-status-jalankan/`,
        { id: dataId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(id);
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
      console.log("terdapat error saat melakukan perubahan status ", error);
    }
  };

  const handlePackaging = async () => {
    try {
      if (window.confirm("apakah data yang dimasukkan sudah benar")) {
        const selectedBarang = detailKeluar.map((item) => {
          let jumlahRusak = jumlahRusakByItem[item.dpackaging_id] ?? 0;
          if (isNaN(jumlahRusak)) {
            jumlahRusak = 0;
          }
          return {
            dpackaging_id: item.dpackaging_id,
            jumlah_rusak: jumlahRusak,
            detail_barang: item.detail_barang,
          };
        });
        setDataDetailKeluar(selectedBarang);
        console.log(selectedBarang);
        // return;
        const response = await axios.post(
          "http://127.0.0.1:8000/api/packaging/do-packaging",
          {
            id: dataId,
            detail_transaksi: selectedBarang,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log(response);
        console.log(detailKeluar);
        openSuccessSB();
        getId();
      }
    } catch (error) {
      openErrorSB();
      console.log("terdapat error saat melakukan perubahan status ", error);
    }
  };

  // END API

  useEffect(() => {
    getId();
  }, []);

  useEffect(() => {
    navigateAndClearTokenUser(navigate);
  }, [navigate]);

  const columns = [
    { Header: "Nomor", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang", accessor: "nama", width: "10%", align: "left" },
    { Header: "Exp Barang", accessor: "exp", align: "center" },
    { Header: "Batch Barang", accessor: "batch", align: "center" },
    // { Header: "Stok Barang", accessor: "batch", align: "center" },
    { Header: "Jumlah Packaging", accessor: "jumlahpack", align: "center" },
    { Header: "Jumlah Rusak", accessor: "jumlahrusak", align: "center" },
    { Header: "Jumlah Berhasil", accessor: "jumlahberhasil", align: "center" },
  ];

  let rows;
  if (headerKeluar.hpackaging_status != 0) {
    rows = detailKeluar.map((item, index) => ({
      index: index + 1,
      nama: "Tahu POO Polos",
      exp: item.detail_barang.detailbarang_expdate,
      batch: item.detail_barang.detailbarang_batch,
      jumlahpack: item.dpackaging_jumlah,
      // jumlahrusak: item.dpackaging_jumlahrusak,
      jumlahberhasil: item.dpackaging_jumlahberhasil,
      jumlahrusak: (
        <MDInput
          type="number"
          value={jumlahRusakByItem[item.dpackaging_id]}
          inputProps={{ min: 0 }}
          error={isInputInvalid[item.dpackaging_id]}
          helperText={
            isInputInvalid[item.dpackaging_id] ? "Jumlah melebihi stok yang tersedia" : ""
          }
          onChange={(e) => handleChangeJumlahKirim(item.dpackaging_id, e.target.value)}
          sx={{ "& .MuiInput-root": { borderColor: isInputInvalid[item.dkeluar_id] ? "red" : "" } }}
        ></MDInput>
      ),
    }));
  } else {
    rows = detailKeluar.map((item, index) => ({
      index: index + 1,
      nama: "Tahu POO Polos",
      exp: item.detail_barang.detailbarang_expdate,
      batch: item.detail_barang.detailbarang_batch,
      jumlahpack: item.dpackaging_jumlah,
      // jumlahrusak: item.dpackaging_jumlahrusak,
      jumlahberhasil: item.dpackaging_jumlahberhasil,
      jumlahrusak: item.dpackaging_jumlahrusak,
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
      content="Berhasil Melakukan Packaging"
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
      content="Error Melakukan Packaging"
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
                <PrintableFormPackaging detailKeluar={detailKeluar} headerKeluar={headerKeluar} />
              </div>
              <Grid container mt={4}>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">
                    Nomor Nota : {headerKeluar.hpackaging_nota}
                  </MDTypography>
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
                    Pembuat : {headerKeluar.pengguna_generate?.pengguna_nama}
                  </MDTypography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <MDTypography variant="h6">
                    Penanggung Jawab : {headerKeluar.hpackaging_penanggungjawab}
                  </MDTypography>
                </Grid>
              </Grid>

              {/* Data Table */}
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

              {headerKeluar.hpackaging_status === 1 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleJalankan}>
                      Print dan Jalankan
                    </MDButton>
                  </Grid>
                </Grid>
              )}

              {headerKeluar.hpackaging_status === 2 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={6}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handleJalankan}>
                      Print
                    </MDButton>
                  </Grid>
                  <Grid item xs={6}>
                    <MDButton
                      variant="gradient"
                      color="success"
                      fullWidth
                      onClick={handlePackaging}
                    >
                      Buat Packaging
                    </MDButton>
                  </Grid>
                </Grid>
              )}

              {/* {headerKeluar.hkeluar_status !== 3 && (
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
              )} */}
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

export default DetailPackaging;

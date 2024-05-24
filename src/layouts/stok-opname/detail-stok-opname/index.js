import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDInput from "components/MDInput";
import PrintableDetailStokOpname from "./PrintableDetailStokOpname";
import { jwtDecode } from "jwt-decode";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailStokOpname() {
  const [detailBarangMasuk, setDetailBarangMasuk] = useState([]);
  const [headerBarangMasuk, setHeaderlBarangMasuk] = useState([]);
  const [detailBarang, setDetailBarang] = useState([]);
  const [dataPenyesuaian, setDataPenyesuaian] = useState([]);
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

  // Handle modal
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const openRejectModalHandler = () => {
    setOpenRejectModal(true);
  };

  const closeRejectModalHandler = () => {
    setOpenRejectModal(false);
    setRejectReason("");
  };

  // end Handle modal

  const accessToken = localStorage.getItem("access_token");
  const decode = jwtDecode(accessToken);

  // API

  const getId = async () => {
    try {
      const id = await axios.get(
        `https://api.tahupoosby.com/api/stok-opname/get-stok-opname/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const response = await axios.get(
        `https://api.tahupoosby.com/api/stok-opname/get-detail-opname/${id.data.opname_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const res = await axios.get(
        `https://api.tahupoosby.com/api/stok-opname/get-penyesuaian/${id.data.opname_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setDataPenyesuaian(res.data);
      //   console.log("hasil get id", response.data);
      console.log(id.data);
      setDetailBarangMasuk(response.data);
      setHeaderlBarangMasuk(id.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const getDetailBarang = async (opname_id) => {
    try {
      const res = await axios.get(
        `https://api.tahupoosby.com/api/stok-opname/get-detail-barang/${opname_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setDetailBarang(res.data);
    } catch (error) {
      console.log("terdapat error saat mengambil data detail barang ", error);
    }
  };

  const handleApprove = async () => {
    if (window.confirm("Apakah anda ingin melakukan proses Approve?")) {
      try {
        const res = await axios.post(
          `https://api.tahupoosby.com/api/stok-opname/approve-stok-opname`,
          { opname_id: headerBarangMasuk.opname_id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        // alert(headerBarangMasuk.opname_id);
        openSuccessSB();
        getId();
      } catch (error) {
        openErrorSB();
        console.error("Terjadi kesalahan saat melakukan approval surat jalan : ", error);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("Apakah anda yakin ingin melakukan Reject?")) {
      if (!rejectReason.trim()) {
        alert("Box Alasan harus diisi");
        return;
      }
      try {
        const res = await axios.post(
          `https://api.tahupoosby.com/api/stok-opname/reject-stok-opname`,
          { opname_id: headerBarangMasuk.opname_id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // console.log(response);
        closeRejectModalHandler();
        openSuccessRejectSB();
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

  // END API

  useEffect(() => {
    getId();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);

  const handlePrint = async () => {
    // console.log(headerBarangMasuk.opname_id);
    getDetailBarang(headerBarangMasuk.opname_id);
    try {
      if (headerBarangMasuk.opname_status == 0) {
        const response = await axios.post(
          `https://api.tahupoosby.com/api/stok-opname/update-status-ongoing`,
          { opname_id: headerBarangMasuk.opname_id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        getId();
      }

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
    } catch (error) {}
  };

  const handleDetailPenyesuaian = () => {
    navigate(`/detail-penyesuaian/${headerBarangMasuk.opname_id}`);
  };

  const columns = [
    { Header: "Nama Barang", accessor: "namabarang", width: "10%", align: "left" },
    { Header: "Jumlah Awal", accessor: "detailopname_stokawal", align: "center" },
    { Header: "Jumlah Masuk", accessor: "detailopname_stokmasuk", align: "center" },
    { Header: "Jumlah Keluar", accessor: "detailopname_stokkeluar", align: "center" },
    { Header: "Jumlah Barang Tercatat", accessor: "detailopname_stoktercatat", align: "center" },
    { Header: "Detail", accessor: "detail", align: "center" },
  ];

  const rows = detailBarangMasuk.map((item) => {
    return {
      namabarang: item.barang?.barang_nama,
      detailopname_stokawal: item.detailopname_stokawal,
      detailopname_stokmasuk: item.detailopname_stokmasuk,
      detailopname_stokkeluar: item.detailopname_stokkeluar,
      detailopname_stoktercatat: item.detailopname_stoktercatat,
      detail: (
        <Link to={`/detail-barang/${item.barang?.barang_id}`}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Detail
          </MDTypography>
        </Link>
      ),
    };
  });

  const columns2 = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang", accessor: "barang", align: "center" },
    { Header: "Batch Barang", accessor: "batch", align: "center" },
    { Header: "Tempat Barang", accessor: "tempat", align: "center" },
    { Header: "Jumlah Tercatat", accessor: "tercatat", align: "center" },
    { Header: "Jumlah Aktual", accessor: "aktual", align: "center" },
    { Header: "Jumlah Difference", accessor: "difference", align: "center" },
    { Header: "Catatan", accessor: "catatan", align: "center" },
  ];

  const rows2 = dataPenyesuaian.map((item, index) => {
    return {
      index: index + 1,
      barang: item.detail_barang?.barang?.barang_nama || "-",
      batch: item.detail_barang?.detailbarang_batch || "-",
      tempat: item.penempatan_produk?.get_rack?.get_rows?.row_name
        ? `Rows ${item.penempatan_produk.get_rack.get_rows.row_name}, Sel ${item.penempatan_produk.get_rack.rack_bay}, Level ${item.penempatan_produk.get_rack.rack_level}`
        : "Dari Bulk",
      tercatat: item.detailbarangopname_jumlahditempat || "-",
      aktual: item.detailbarangopname_jumlahaktual || "-",
      difference: item.detailbarangopname_jumlahdifference || "-",
      catatan: item.detailbarangopname_catatan || "-",
    };
  });

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil Melakukan approve Stok opname"
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
      content="Error Melakukan approve stok opname"
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
      content="Berhasil Melakukan Reject stok opname"
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
      content="Error Melakukan Reject stok opname"
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
                <PrintableDetailStokOpname
                  // detailKeluar={detailBarangMasuk}
                  headerKeluar={headerBarangMasuk}
                  detailBarang={detailBarang}
                />
              </div>
              {/* <Grid container pt={4}>
                <Grid item xs={12}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </Grid>
              </Grid> */}
              <Grid container pt={4}>
                <Grid item xs={12}>
                  <DataTable
                    table={{ columns: columns2, rows: rows2 }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </Grid>
              </Grid>
              {headerBarangMasuk.opname_status === 2 && decode.role_id === 2 && (
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
                      Approve dan Buat Penyesuaian Stok
                    </MDButton>
                  </Grid>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                      Show Document
                    </MDButton>
                  </Grid>
                </Grid>
              )}

              {/* {headerBarangMasuk.opname_status === 0 ||
                (headerBarangMasuk.opname_status === 1 && (
                  <Grid container pt={5} spacing={7} px={3} mb={4}>
                    <Grid item xs={12}>
                      <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                        {headerBarangMasuk.opname_status === 1
                          ? "Print"
                          : "Print dan Jalankan Stok Opname"}
                      </MDButton>
                    </Grid>
                  </Grid>
                ))} */}
              {headerBarangMasuk.opname_status === 0 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                      Print dan Jalankan Stok Opname
                    </MDButton>
                  </Grid>
                </Grid>
              )}

              {headerBarangMasuk.opname_status === 1 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={12}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                      Print
                    </MDButton>
                  </Grid>
                </Grid>
              )}

              {headerBarangMasuk.opname_status === 4 && (
                <Grid container pt={5} spacing={7} px={3} mb={4}>
                  <Grid item xs={6}>
                    <MDButton variant="gradient" color="info" fullWidth onClick={handlePrint}>
                      Show Document
                    </MDButton>
                  </Grid>
                  <Grid item xs={6}>
                    <MDButton
                      variant="gradient"
                      color="success"
                      fullWidth
                      onClick={handleDetailPenyesuaian}
                    >
                      Detail Penyesuaian
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

      {/* <Dialog open={openTahuModal} onClose={closeTahuModalHandler}>
        <DialogTitle>Apakah Terdapat proses Packaging untuk tahu polos?</DialogTitle>
        <DialogContent>
          <RadioGroup
            aria-label="tahu-polos-option"
            name="tahu-polos-option"
            value={isPackaging}
            onChange={(e) => setIsPackaging(e.target.value)}
          >
            <FormControlLabel value={1} control={<Radio />} label="Ya" />
            <FormControlLabel value={0} control={<Radio />} label="Tidak" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <MDButton color="error" onClick={closeTahuModalHandler}>
            Cancel
          </MDButton>
          <MDButton color="success" onClick={handleApprove}>
            Approve
          </MDButton>
        </DialogActions>
      </Dialog> */}
    </DashboardLayout>
  );
}

export default DetailStokOpname;

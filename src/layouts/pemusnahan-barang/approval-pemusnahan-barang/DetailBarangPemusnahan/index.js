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
import dayjs from "dayjs";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import MDInput from "components/MDInput";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailBarangPemusnahan() {
  const [detailBarangMasuk, setDetailBarangMasuk] = useState([]);
  const [headerBarangMasuk, setHeaderlBarangMasuk] = useState([]);
  const [headerPemusnahanBarang, setHeaderPemusnahanBarang] = useState([]);
  const [detailPemusnahanBarang, setDetailPemusnahanBarang] = useState([]);
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
    setRejectReason(""); // Clear reject reason when modal is closed
  };

  const [openTahuModal, setOpenTahuModal] = useState(false);
  const [isPackaging, setIsPackaging] = useState(null);

  const openTahuModalHandler = () => {
    setOpenTahuModal(true);
  };

  const closeTahuModalHandler = () => {
    setOpenTahuModal(false);
    setIsPackaging(null);
  };
  // end Handle modal

  const accessToken = localStorage.getItem("access_token");
  let tahupolos = false;

  // API

  const getId = async () => {
    try {
      const id = await axios.get(
        `http://127.0.0.1:8000/api/pemusnahan-barang/get-detail-pemusnahan-barang/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const header = await axios.get(
        `http://127.0.0.1:8000/api/pemusnahan-barang/get-header-pemusnahan-barang/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //   const response = await axios.get(
      //     `http://127.0.0.1:8000/api/detailbarang/get-dbarang-masuk/${id.data.hmasuk_id}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${accessToken}`,
      //       },
      //     }
      //   );
      //   console.log("hasil get id", response.data);
      //   console.log(id.data.hmasuk_id);
      //   setDetailBarangMasuk(response.data);
      //   setHeaderlBarangMasuk(id.data);
      setDetailPemusnahanBarang(id.data);
      setHeaderPemusnahanBarang(header.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleApprove = async () => {
    if (window.confirm("Apakah anda ingin melakukan proses Approve?")) {
      try {
        const datatosend = {
          dataId: dataId,
        };
        // console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/pemusnahan-barang/approval-pemusnahan-barang",
          datatosend,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        openSuccessSB();
        getId();
        closeTahuModalHandler();
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
        const datatosend = {
          dataId: dataId,
          hpemusnahan_rejectreason: rejectReason,
        };
        console.log(datatosend);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/pemusnahan-barang/rejected-pemusnahan-barang",
          datatosend,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
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

  const columns = [
    {
      Header: "Nama Barang",
      accessor: "detail_barang.barang.barang_nama",
      width: "10%",
      align: "left",
    },
    { Header: "Jumlah Barang", accessor: "dpemusnahan_jumlahbarang", align: "center" },
    { Header: "Exp Date", accessor: "detail_barang.detailbarang_expdate", align: "center" },
    { Header: "Batch Barang", accessor: "detail_barang.detailbarang_batch", align: "center" },
  ];

  const rows = detailPemusnahanBarang.map((item) => {
    // Check if barang_nama is "Tahu POO polos"
    // if (item.barang.barang_nama === "Tahu POO polos") {
    //   tahupolos = true;
    // }
    return {
      detail_barang: {
        detailbarang_batch: item.detail_barang.detailbarang_batch,
        detailbarang_expdate: dayjs(item.detail_barang.detailbarang_expdate).format("DD-MM-YYYY"),
        barang: { barang_nama: item.detail_barang.barang.barang_nama },
      },
      dpemusnahan_jumlahbarang: item.dpemusnahan_jumlahbarang,
      //   detailbarang_batch: item.detailbarang_batch,
      //   detailbarang_stok: item.detailbarang_stok,
    };
  });

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
              {headerPemusnahanBarang.hpemusnahan_status === 0 && (
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

export default DetailBarangPemusnahan;

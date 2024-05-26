import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { jwtDecode } from "jwt-decode";
import { navigateAndClearTokenKepalaGudang } from "navigationUtils/navigationUtilsKepalaGudang";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailBarangMasuk() {
  const [detailBarangMasuk, setDetailBarangMasuk] = useState([]);
  const [headerBarangMasuk, setHeaderlBarangMasuk] = useState([]);
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

  // const navigate = useNavigate();
  // useEffect(() => {
  //   navigateAndClearTokenKepalaGudang(navigate);
  // }, [navigate]);

  const accessToken = localStorage.getItem("access_token");
  let decode = null;
  if (accessToken) {
    decode = jwtDecode(accessToken);
    if (decode.role_id == 3) {
      localStorage.removeItem("access_token");
      window.location.href = "/authentication/sign-in";
    }
  } else {
    window.location.href = "/authentication/sign-in";
  }
  let tahupolos = false;

  // API

  const getId = async () => {
    try {
      const id = await axios.get(
        `https://api.tahupoosby.com/api/detailbarang/get-barang-masuk-id/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const response = await axios.get(
        `https://api.tahupoosby.com/api/detailbarang/get-dbarang-masuk/${id.data.hmasuk_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //   console.log("hasil get id", response.data);
      //   console.log(id.data.hmasuk_id);
      setDetailBarangMasuk(response.data);
      setHeaderlBarangMasuk(id.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil input data Barang keluar:", error);
    }
  };

  const handleApprove = async () => {
    if (window.confirm("Apakah anda ingin melakukan proses Approve?")) {
      try {
        const datatosend = {
          dataId: dataId,
          hmasuk_statuspackaging: isPackaging,
        };
        // console.log(datatosend);
        const response = await axios.post(
          "https://api.tahupoosby.com/api/detailbarang/approval-barang-masuk",
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
          hmasuk_comment: rejectReason,
        };
        console.log(datatosend);
        const response = await axios.post(
          "https://api.tahupoosby.com/api/detailbarang/reject-barang-masuk",
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
    { Header: "Nama Barang", accessor: "barang.barang_nama", width: "10%", align: "left" },
    { Header: "Exp Barang", accessor: "detailbarang_expdate", align: "center" },
    { Header: "Batch Barang", accessor: "detailbarang_batch", align: "center" },
    { Header: "Jumlah Barang Datang", accessor: "detailbarang_stokmasuk", align: "center" },
    { Header: "Jumlah Barang Rusak", accessor: "detailbarang_jumlahrusakmasuk", align: "center" },
    { Header: "Jumlah Barang Pack", accessor: "jumlahpack", align: "center" },
    { Header: "Jumlah Rusak Pack", accessor: "jumlahrusakpack", align: "center" },
    { Header: "Jumlah Barang Masuk", accessor: "detailbarang_stok", align: "center" },
  ];

  const rows = detailBarangMasuk.map((item) => {
    // Check if barang_nama is "Tahu POO polos"
    if (item.barang.barang_nama === "Tahu POO polos") {
      if (decode.jenis_gudang == 2) {
        tahupolos = false;
      } else {
        tahupolos = true;
      }
    }
    return {
      jumlahpack: item.detailbarang_jumlahpack,
      jumlahrusakpack: item.detailbarang_jumlahrusakpack,
      barang: { barang_nama: item.barang.barang_nama },
      detailbarang_expdate: dayjs(item.detailbarang_expdate).format("DD-MM-YYYY"),
      detailbarang_batch: item.detailbarang_batch,
      detailbarang_stokmasuk: item.detailbarang_stokmasuk,
      detailbarang_jumlahrusakmasuk: item.detailbarang_jumlahrusakmasuk,
      detailbarang_stok: item.detailbarang_stok,
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
              {headerBarangMasuk.hmasuk_status === 2 && decode.role_id === 2 && (
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
                    <MDButton
                      variant="gradient"
                      color="success"
                      fullWidth
                      // onClick={tahupolos ? openTahuModalHandler : handleApprove}
                      onClick={handleApprove}
                    >
                      {/* {tahupolos ? "Open Tahu Modal" : "Approve"} */}
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

export default DetailBarangMasuk;

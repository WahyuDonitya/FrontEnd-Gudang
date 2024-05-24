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

// Data
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import MDBadge from "components/MDBadge";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { SignalCellularNullTwoTone } from "@mui/icons-material";

function DetailBarang() {
  const today = dayjs();
  const [detailBarang, setDetailBarang] = useState([]);
  const [jumlahPenempatan, setJumlahPenempatan] = useState(0);
  const [jumlahDapatPlacement, setJumlahDapatPlacement] = useState(0);
  const [positionAvailable, setPositionAvailable] = useState([]);
  const [positionDipilih, setPositionDipilih] = useState(null);
  const [detailBarangId, setDetailBarangId] = useState(null);
  const { dataId } = useParams();
  const { gudangId } = useParams();
  const accessToken = localStorage.getItem("access_token");

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  // render Notificartion
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil menambahkan barang Masuk"
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
      content="Error saat menambahkan Barang Masuk"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  // API
  const getDetailBarang = async () => {
    if (!gudangId) {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/detailbarang/get-detail-by-barang-id/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDetailBarang(response.data);
    } else {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/detailbarang/get-detail-by-barang-id/${dataId}/${gudangId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDetailBarang(response.data);
    }
  };

  const getPositionAvailable = async () => {
    try {
      const response = await axios.get(
        "https://api.tahupoosby.com/api/positioning/get-positioning-available",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // console.log(response.data);
      setPositionAvailable(response.data);
    } catch (error) {
      console.log("terdapat kesalahan saat mengambil data position", error);
    }
  };

  const addPenempatan = async () => {
    if (!positionDipilih || jumlahPenempatan <= 0) {
      alert("Inputan tidak boleh ada yang kosong");
    } else {
      if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
        try {
          const response = await axios.post(
            `https://api.tahupoosby.com/api/positioning/add-placement`,
            {
              detailbarang_id: detailBarangId,
              rack_id: positionDipilih,
              penempatanproduk_jumlah: jumlahPenempatan,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          closeRejectModalHandler();
          getDetailBarang();
          openSuccessSB();
        } catch (error) {
          console.log("terdapat kesalahan saat melakukan placement", error);
          closeRejectModalHandler();
          openErrorSB();
        }
      }
    }
  };

  // End API

  useEffect(() => {
    getDetailBarang();
    getPositionAvailable();
  }, []);

  // Handle modal
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const closeRejectModalHandler = () => {
    setOpenRejectModal(false);
    setJumlahPenempatan(0);
    setJumlahDapatPlacement(0);
    setPositionDipilih(null);
    setDetailBarangId(null);
  };

  // End handle modal

  // function
  const handleChangeJumlahPlacement = (newValue) => {
    if (newValue > 50) {
      alert("Maksimal placement 1 tempat 50 barang");
    } else {
      if (newValue > jumlahDapatPlacement) {
        alert("tidak dapat melebihi jumlah yang dapat dipacking");
      } else {
        setJumlahPenempatan(newValue);
      }
    }
  };
  // End Function
  let columns = null;
  let rows = null;

  if (!gudangId) {
    columns = [
      { Header: "No . ", accessor: "nomor", width: "3%", align: "center" },
      { Header: "Batch Barang", accessor: "detailbarang_batch", align: "center" },
      { Header: "Exp Date", accessor: "detailbarang_expdate", align: "center" },
      { Header: "Jumlah Barang saat datang", accessor: "detailbarang_stokmasuk", align: "center" },
      { Header: "Jumlah rusak saat masuk", accessor: "jumlahrusakmasuk", align: "center" },
      { Header: "Stok Barang", accessor: "detailbarang_stok", align: "center" },
      {
        Header: "Jumlah yang butuh tempat",
        accessor: "detailbarang_jumlahplacement",
        align: "center",
      },
      {
        Header: "Jumlah Pack",
        accessor: "jumlahpack",
        align: "center",
      },
      { Header: "Jumlah rusak pack", accessor: "jumlahrusakpack", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Penempatan", accessor: "action", align: "center" },
      { Header: "Cek Tempat", accessor: "cek", align: "center" },
    ];

    rows = detailBarang.map((item, index) => {
      const isExpired = dayjs(item.detailbarang_expdate).isBefore(today);
      let statusPlacement = false;
      if (item.detailbarang_jumlahplacement > 0 && !isExpired) {
        statusPlacement = true;
      }

      const openRejectModalHandler = () => {
        setOpenRejectModal(true);
        setJumlahDapatPlacement(item.detailbarang_jumlahplacement);
        setDetailBarangId(item.detailbarang_id);
      };

      return {
        nomor: index + 1,
        detailbarang_batch: item.detailbarang_batch,
        jumlahrusakmasuk: item.detailbarang_jumlahrusakmasuk,
        detailbarang_expdate: dayjs(item.detailbarang_expdate).format("DD-MM-YYYY"),
        detailbarang_stokmasuk: item.detailbarang_stokmasuk,
        jumlahpack: item.detailbarang_jumlahpack,
        jumlahrusakpack: item.detailbarang_jumlahrusakpack,
        detailbarang_jumlahplacement: item.detailbarang_jumlahplacement,
        detailbarang_stok: item.detailbarang_stok,
        status: isExpired ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Expired" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ) : (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Not Expired" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: statusPlacement ? (
          <MDTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={openRejectModalHandler}
          >
            Action
          </MDTypography>
        ) : (
          "-"
        ),
        cek: (
          <Link to={`/list-tempat-barang/${item.detailbarang_id}`}>
            <MDTypography variant="caption" color="text" fontWeight="medium">
              Detail
            </MDTypography>
          </Link>
        ),
      };
    });
  } else {
    columns = [
      { Header: "No . ", accessor: "nomor", width: "3%", align: "center" },
      { Header: "Batch Barang", accessor: "detailbarang_batch", align: "center" },
      { Header: "Exp Date", accessor: "detailbarang_expdate", align: "center" },
      { Header: "Jumlah Barang saat datang", accessor: "detailbarang_stokmasuk", align: "center" },
      { Header: "Stok Barang", accessor: "detailbarang_stok", align: "center" },
      {
        Header: "Jumlah yang butuh tempat",
        accessor: "detailbarang_jumlahplacement",
        align: "center",
      },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Cek Tempat", accessor: "cek", align: "center" },
    ];

    rows = detailBarang.map((item, index) => {
      const isExpired = dayjs(item.detailbarang_expdate).isBefore(today);
      let statusPlacement = false;
      if (item.detailbarang_jumlahplacement > 0) {
        statusPlacement = true;
      }

      const openRejectModalHandler = () => {
        setOpenRejectModal(true);
        setJumlahDapatPlacement(item.detailbarang_jumlahplacement);
        setDetailBarangId(item.detailbarang_id);
      };

      return {
        nomor: index + 1,
        detailbarang_batch: item.detailbarang_batch,
        detailbarang_expdate: dayjs(item.detailbarang_expdate).format("DD-MM-YYYY"),
        detailbarang_stokmasuk: item.detailbarang_stokmasuk,
        detailbarang_jumlahplacement: item.detailbarang_jumlahplacement,
        detailbarang_stok: item.detailbarang_stok,
        status: isExpired ? (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Expired" color="warning" variant="gradient" size="sm" />
          </MDBox>
        ) : (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Not Expired" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),

        cek: (
          <Link to={`/list-tempat-barang/${item.detailbarang_id}/${gudangId}`}>
            <MDTypography variant="caption" color="text" fontWeight="medium">
              Detail
            </MDTypography>
          </Link>
        ),
      };
    });
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  List Detail Barang
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Dialog open={openRejectModal} onClose={closeRejectModalHandler}>
        <DialogTitle>Penempatan Barang</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "20px", marginTop: "10px" }}>
            <MDInput
              fullWidth
              rows={4}
              variant="outlined"
              label="Masukkan jumlah penempatan"
              value={jumlahPenempatan}
              onChange={(e) => handleChangeJumlahPlacement(e.target.value)}
              type="number"
              inputProps={{ max: 50, min: 0 }}
            />
          </div>

          {Array.isArray(positionAvailable) && positionAvailable.length > 0 ? (
            <div style={{ marginBottom: "10px" }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={positionAvailable}
                getOptionLabel={(option) =>
                  `Baris : ${option.get_rows.row_name}, Sel : ${option.rack_bay}, Level : ${option.rack_level} (${option.rack_ketersediaan})`
                }
                fullWidth
                renderInput={(params) => <TextField {...params} label="Pilih Posisi" />}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setPositionDipilih(newValue.rack_id);
                  } else {
                    setPositionDipilih(null);
                  }
                }}
              />
            </div>
          ) : (
            <p>Tidak ada Posisi</p>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton color="error" onClick={closeRejectModalHandler}>
            Cancel
          </MDButton>
          <MDButton color="success" onClick={addPenempatan}>
            Tambahkan
          </MDButton>
        </DialogActions>
      </Dialog>

      <MDBox p={2}>
        <Grid container spacing={6}>
          {renderSuccessSB}
          {renderErrorSB}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default DetailBarang;

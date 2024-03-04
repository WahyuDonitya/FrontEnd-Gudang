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

function ListTempatBarang() {
  const [tempatBarang, setTempatBarang] = useState([]);
  const dataId = useParams();
  const accessToken = localStorage.getItem("access_token");
  const [posisiAwal, setPosisiAwal] = useState(null);
  const [penempatanId, setPenempatanId] = useState(null);
  const [positionAvailable, setPositionAvailable] = useState([]);
  const [detailBarangId, setDetailBarangId] = useState(null);
  const [positionDipilih, setPositionDipilih] = useState(null);
  const [jumlahProduk, setJumlahProduk] = useState(null);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  // API
  const getTempatBarang = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/positioning/get-position-by-barang/${dataId.dataId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log(res.data);
      setTempatBarang(res.data);
    } catch (error) {
      console.log("Terdapat kesalahan saat mengambil data tempat barang ", error);
    }
  };

  const getPositionAvailable = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/positioning/get-positioning-available",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // console.log(response.data);
      setPositionAvailable(response.data);
    } catch (error) {
      console.log("terdapat kesalahan saat mengambil data position", error);
    }
  };

  const handlePerubahan = async () => {
    try {
      if (!positionDipilih) {
        alert("Harus memilih posisi untuk dipindahkan");
      } else {
        if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
          // alert(positionDipilih);
          const response = await axios.post(
            "http://127.0.0.1:8000/api/positioning/change-position",
            {
              detailbarang_id: detailBarangId,
              rack_id: positionDipilih,
              posisiAwal: posisiAwal,
              penempatanproduk_jumlah: jumlahProduk,
              penempatanproduk_id: penempatanId,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          closeRejectModalHandler();
          openSuccessSB();
          getTempatBarang();
          getPositionAvailable();
        }
      }
    } catch (error) {
      console.log("error saat melakukan pemindahan barang ", error);
      openErrorSB();
    }
  };
  // End API

  useEffect(() => {
    getTempatBarang();
    getPositionAvailable();
  }, []);

  // Handle modal
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const closeRejectModalHandler = () => {
    setOpenRejectModal(false);
    setPositionDipilih(null);
    setDetailBarangId(null);
    setPosisiAwal(null);
    setJumlahProduk(null);
    setPenempatanId(null);
  };

  // render Notificartion
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil Memindahkan Barang"
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
      content="Error saat memindahkan barang"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const columns = [
    { Header: "No . ", accessor: "nomor", width: "3%", align: "center" },
    { Header: "Lokasi Barang", accessor: "lokasi", align: "center" },
    { Header: "Jumlah Barang", accessor: "penempatanproduk_jumlah", align: "center" },
    { Header: "Pindah Barang", accessor: "pindah", align: "center" },
  ];

  const rows = tempatBarang.map((item, index) => {
    const openRejectModalHandler = () => {
      setOpenRejectModal(true);
      setDetailBarangId(item.detailbarang_id);
      setPosisiAwal(item.rack_id);
      setJumlahProduk(item.penempatanproduk_jumlah);
      setPenempatanId(item.penempatanproduk_id);
    };

    return {
      nomor: index + 1,
      lokasi: `Rows : ${item.get_rack.get_rows.row_name}, Sel : ${item.get_rack.rack_bay}, Level : ${item.get_rack.rack_level} `,
      penempatanproduk_jumlah: item.penempatanproduk_jumlah,
      pindah: (
        <MDTypography
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={openRejectModalHandler}
        >
          Action
        </MDTypography>
      ),
    };
  });

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
                  Lokasi Barang
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
        <DialogTitle>Pindah Penempatan Barang</DialogTitle>
        <DialogContent>
          {/* <div style={{ marginBottom: "20px", marginTop: "10px" }}>
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
          </div> */}

          {Array.isArray(positionAvailable) && positionAvailable.length > 0 ? (
            <div style={{ marginBottom: "10px" }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={positionAvailable}
                getOptionLabel={(option) =>
                  `Baris : ${option.get_rows.row_name}, Sel : ${option.rack_bay}, Level : ${option.rack_level}`
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
            <p>Loading customer data...</p>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton color="error" onClick={closeRejectModalHandler}>
            Batalkan
          </MDButton>
          <MDButton color="success" onClick={handlePerubahan}>
            Pindahkan barang
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Untuk Snackbar */}
      <MDBox p={2}>
        <Grid container spacing={6}>
          {renderSuccessSB}
          {renderErrorSB}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListTempatBarang;

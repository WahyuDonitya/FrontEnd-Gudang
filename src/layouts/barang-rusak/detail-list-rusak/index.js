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
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Modal } from "@mui/material";

// Data
// import listpemusnahan from "./data";
// import rejectedSJ from "./data/listRejectSuratJalan";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function DetailListBarangRusak() {
  const [dataDrusak, setDrusak] = useState([]);
  const accessToken = localStorage.getItem("access_token");
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const { dataId } = useParams();

  //   handle pop up gambar
  // Fungsi untuk menampilkan gambar saat tombol view gambar ditekan
  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  // Fungsi untuk menutup tampilan gambar
  const handleCloseImage = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  // End popup gambar

  // API
  const getDbarangRusak = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/barang-rusak/get-dbarang-rusak/${dataId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setDrusak(response.data);
    } catch (error) {
      console.log("terjadi kesalahan saat mengambil data barang rusak ", error);
    }
  };
  // End API

  useEffect(() => {
    getDbarangRusak();
  }, []);

  const columns = [
    { Header: "No. ", accessor: "index", width: "10%", align: "left" },
    { Header: "Nama Barang", accessor: "barang", align: "center" },
    { Header: "Batch Barang", accessor: "batch", align: "center" },
    { Header: "Tempat Barang", accessor: "tempat", align: "center" },
    { Header: "Jumlah Barang", accessor: "dbarangrusak_jumlah", align: "center" },
    { Header: "View Gambar", accessor: "action", align: "center" },
  ];

  const rows = dataDrusak.map((item, index) => {
    const rack = item.penempatan_produk?.get_rack;
    const rowName = rack?.get_rows?.row_name;
    const rackBay = rack?.rack_bay;
    const rackLevel = rack?.rack_level;

    const tempat =
      rowName || rackBay || rackLevel
        ? `Rows ${rowName}, Sel ${rackBay}, Level ${rackLevel}`
        : "bulk";
    return {
      index: index + 1,
      barang: item.detail_barang.barang.barang_nama,
      batch: item.detail_barang.detailbarang_batch,
      tempat: tempat,
      dbarangrusak_jumlah: item.dbarangrusak_jumlah,
      // Tombol view gambar
      action: item.file_foto && ( // Menambahkan pengecekan di sini
        <Button onClick={() => handleViewImage(item.file_foto)}>View Gambar</Button>
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
                  Detail Barang Rusak
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                  canSearch
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Modal
        open={open}
        onClose={handleCloseImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img src={selectedImage} alt="Gambar" style={{ maxWidth: "100%", maxHeight: "100%" }} />
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default DetailListBarangRusak;

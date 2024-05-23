// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
// import PrintAbleKartuStok from "./PrintAbleKartuStok";

// Data
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MDButton from "components/MDButton";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { navigateAndClearTokenUser } from "navigationUtils/navigationUtilsUser";
import { jwtDecode } from "jwt-decode";

function InventoryAging() {
  //   state
  const [barang, setBarang] = useState([]);
  const [gudangs, setGudangs] = useState([]);
  const [GudangPick, setGudangPick] = useState(null);

  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return <Navigate to="/authentication/sign-in" />;
  }

  const decodedToken = jwtDecode(accessToken);
  // if (decodedToken.role_id == 1) {
  //   localStorage.removeItem("access_token");
  //   return <Navigate to="/authentication/sign-in" />;
  // }

  //   Pemanggilan API
  const getBarang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/report/inventory-aging", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setBarang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Barang :", error);
    }
  };

  const getBarangWithGudang = async (newValue) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/report/inventory-aging/${newValue.gudang_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      console.log(GudangPick);
      setBarang(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Barang :", error);
    }
  };

  const getGudang = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/gudang/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("Data Customer:", response.data);
      setGudangs(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  useEffect(() => {
    if (decodedToken.role_id === 3) {
      getGudang();
    } else {
      getBarang();
    }
  }, []);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigateAndClearTokenUser(navigate);
  // }, [navigate]);

  //   function

  const columns = [
    { Header: "No. ", accessor: "nomor", align: "center" },
    { Header: "Nama Barang ", accessor: "barang_nama", align: "center" },
    { Header: "Batch Barang ", accessor: "detailbarang_batch", align: "center" },
    { Header: "Stok Barang ", accessor: "detailbarang_stok", align: "center" },
    { Header: "Lama Di Gudang", accessor: "umur_inventaris", align: "center" },
  ];

  const rows = barang.map((item, index) => ({
    nomor: index + 1,
    barang_nama: item.barang_nama,
    detailbarang_batch: item.detailbarang_batch,
    detailbarang_stok: item.detailbarang_stok,
    umur_inventaris: `${item.umur_inventaris} Hari`,
  }));

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
                  Inventory Aging
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {decodedToken.role_id === 3 ? (
                  <Grid container>
                    <Grid item xs={12} pt={4} px={2}>
                      {Array.isArray(gudangs) && gudangs.length > 0 ? (
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={gudangs}
                          value={gudangs.find((gudang) => gudang.gudang_id === GudangPick) || null}
                          getOptionLabel={(option) =>
                            `${option.gudang_nama} (${
                              option.jenis_gudang.jenis_gudang_nama || "gamuncul"
                            })`
                          }
                          fullWidth
                          renderInput={(params) => <TextField {...params} label="Pilih Gudang" />}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setGudangPick(newValue.gudang_id);
                              getBarangWithGudang(newValue);
                            } else {
                              setGudangPick(null);
                              setBarang([]);
                            }
                          }}
                        />
                      ) : (
                        <p>Tidak Ada Gudang</p>
                      )}
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                )}
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  canSearch
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default InventoryAging;

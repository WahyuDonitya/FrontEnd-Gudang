import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Header from "../components/Header";
import {
  Autocomplete,
  Divider,
  TextField,
  IconButton,
  Icon,
  AppBar,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";

// data
import dataPositioning from "./data/DataPositioning";
import { useNavigate } from "react-router-dom";

function MasterPositioning() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [errorMessages, setErrorMessages] = useState({});

  // Tambahkan state lokal untuk input di setiap tab
  const [row, setRows] = useState([]);
  const [namaRows, setNamaRows] = useState("");
  const [selectedRows, setSelectedRows] = useState(null);
  const [namaRak, setNamaRak] = useState(0);
  const [level, setLevel] = useState(0);
  const [rowsId, setRowsId] = useState(null);
  const [position, setPosition] = useState([]);

  // state untuk notification
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const accessToken = localStorage.getItem("access_token");
  let gudang_id;
  if (accessToken) {
    // Decode token
    const tokenParts = accessToken.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));

    // Ambil nilai gudang_id
    gudang_id = payload.gudang_id;
  }
  // API

  const getRows = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/positioning/get-rows`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setRows(response.data);
    } catch (error) {
      console.log("terdapat kesalahan saat mengambil data rows ", error);
    }
  };

  const getPositioning = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/positioning/get-positioning", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response.data);
      setPosition(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data Gudang:", error);
    }
  };

  const handleDelete = async (rack) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/positioning/delete-positioning/${rack}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getPositioning();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus barang:", error);
      }
    }
  };

  const handleDeleteRow = async (row) => {
    if (window.confirm("Anda yakin ingin menghapus barang ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/positioning/delete-row/${row}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        getRows();
        getPositioning();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus row:", error);
      }
    }
  };

  useEffect(() => {
    getRows();
    getPositioning();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("access_token");
    if (!hasToken) {
      navigate("/authentication/sign-in");
    }
  }, [navigate]);
  // End API

  const addRows = async () => {
    if (window.confirm("apakah data yang anda masukkan sudah benar")) {
      if (namaRows == "") {
        alert("rows yang ingin dimasukkan masih kosong");
      } else {
        const filteredData = row.filter((r) => r.row_name.toLowerCase() === namaRows.toLowerCase());
        if (filteredData.length > 0) {
          alert("Rows dengan nama tersebut sudah ada");
          return;
        }
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/api/positioning/add-rows`,
            { row_name: namaRows },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setNamaRows("");
          openSuccessSB();
          getRows();
        } catch (error) {
          console.log("terjadi kesalahan saat menambahkan data ", error);
          openErrorSB();
        }
      }
    }
  };

  const addRack = async () => {
    if (!selectedRows || namaRak <= 0 || level <= 0) {
      alert("Terdapat inputan yang kosong");
    } else {
      if (window.confirm("Apakah data yang anda masukkan sudah benar?")) {
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/api/positioning/add-sel-level`,
            {
              row_id: selectedRows,
              rack_bay: namaRak,
              rack_level: level,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setSelectedRows(null);
          setNamaRak(0);
          setLevel(0);
          getPositioning();
          openSuccessSB();
        } catch (error) {
          console.log("terdapat kesalahan saat menambahkan data rack ", error);
          openErrorSB();
        }
      }
    }
  };

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleChangeRows = (newValue) => {
    // console.log(newValue.row_id);
    setSelectedRows(newValue.row_id);
  };

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  // render Notificartion
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Notifikasi Berhasil"
      content="Berhasil menambahkan barang"
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
      content="Error saat menambahkan Barang"
      dateTime="Baru Saja"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  // Render Form
  const renderForm = () => {
    if (tabValue === 0) {
      // Jika tab "Baris" yang aktif
      return (
        <>
          <Grid container spacing={7}>
            <Grid item xs={12}>
              <MDInput
                label="Nama Rows"
                fullWidth
                type="text"
                value={namaRows}
                onChange={(e) => {
                  setNamaRows(e.target.value);
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <MDButton variant="gradient" color="success" fullWidth onClick={addRows}>
                Add Data
              </MDButton>
            </Grid>
            {/* Tambahkan elemen-elemen form tambahan sesuai kebutuhan */}
          </Grid>
          <MDBox pt={3} pb={4}>
            <DataTable
              table={{ columns: columns2, rows: rows2 }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
        </>
      );
    } else {
      // Jika tab "Rak" yang aktif
      return (
        <>
          <Grid container spacing={7}>
            <Grid item xs={12}>
              {Array.isArray(row) && row.length > 0 ? (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={row}
                  value={row.find((r) => r.row_id === rowsId) || null}
                  getOptionLabel={(option) => `${option.row_name || "kosong"}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleChangeRows(newValue);
                      setRowsId(newValue.row_id);
                    } else {
                      setSelectedRows(null);
                      setRowsId(null);
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Rows Penyimpanan" />}
                />
              ) : (
                <p>Tidak ada data rows</p>
              )}
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Nomor Sel"
                fullWidth
                type="number"
                value={namaRak}
                onChange={(e) => {
                  setNamaRak(e.target.value);
                }}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Nomor Level"
                fullWidth
                type="number"
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                }}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <MDButton variant="gradient" color="success" fullWidth onClick={addRack}>
                Add Rack
              </MDButton>
            </Grid>
            {/* Tambahkan elemen-elemen form tambahan sesuai kebutuhan */}
          </Grid>
          <MDBox pt={3} pb={4}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
        </>
      );
    }
  };
  const columns = [
    { Header: "Row Name", accessor: "get_rows.row_name", width: "12%", align: "left" },
    { Header: "Sel", accessor: "rack_bay", align: "center" },
    { Header: "Level", accessor: "rack_level", align: "center" },
    {
      Header: "Delete",
      accessor: "delete",
      width: "12%",
      align: "center",
    },
  ];

  const rows = position.map((item) => ({
    get_rows: { row_name: item.get_rows.row_name },
    rack_bay: item.rack_bay,
    rack_level: item.rack_level,
    delete: (
      <IconButton onClick={() => handleDelete(item.rack_id)} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    ),
  }));

  const columns2 = [
    { Header: "Nomor.", accessor: "index", width: "12%", align: "left" },
    { Header: "Nama Row", accessor: "rowname", align: "center" },
    { Header: "Delete", accessor: "delete", align: "center" },
  ];

  const rows2 = row.map((item, index) => ({
    index: index + 1,
    rowname: item.row_name,
    delete: (
      <IconButton onClick={() => handleDeleteRow(item.row_id)} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    ),
  }));

  // const { columns, rows } = dataPositioning();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <Grid container>
            <Grid item xs={6}>
              <MDTypography variant="h6" fontWeight="medium">
                {tabValue === 0 ? "Row Penyimpanan" : "Rak Penyimpanan"}
              </MDTypography>
            </Grid>
            <Grid item xs={6} md={6} lg={4} sx={{ ml: "auto" }}>
              <AppBar position="static">
                <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                  <Tab
                    label="Baris"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        home
                      </Icon>
                    }
                  />
                  <Tab
                    label="Rak"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        email
                      </Icon>
                    }
                  />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>

          {/* <Grid container spacing={7}>
            {renderForm()}
          </Grid> */}
          {renderForm()}
          {/* <MDBox pt={3} pb={4}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox> */}
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            {renderSuccessSB}
            {renderErrorSB}
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default MasterPositioning;

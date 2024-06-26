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
import approvalBarangMasuk from "./data/approvalTableData";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { navigateAndClearTokenKepalaGudang } from "navigationUtils/navigationUtilsKepalaGudang";
// import rejectedSJ from "./data/listRejectSuratJalan";
// import projectsTableData from "layouts/tables/data/projectsTableData";

function ApprovalPemusnahanBarang() {
  const { columns, rows } = approvalBarangMasuk();
  const navigate = useNavigate();

  useEffect(() => {
    navigateAndClearTokenKepalaGudang(navigate);
  }, [navigate]);
  //   const { columnsreject, rowsreject } = rejectedSJ();

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
                  List Approval Pemusnahan Barang
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
    </DashboardLayout>
  );
}

export default ApprovalPemusnahanBarang;

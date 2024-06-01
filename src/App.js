import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DetailData from "layouts/barang-keluar/approval-barang-keluar/components/DetailData";
import DetailSJ from "layouts/surat-jalan/approval-surat-jalan/DetailSJ";
import DetailBarangMasuk from "layouts/barang-masuk/approval-barang-masuk/DetailBarangMasuk";
import DetailMB from "layouts/mutasi-barang/ApprovalMutasi/detailMB";
import DetailSJTrans from "layouts/surat-jalan/approval-surat-jalan/DetailSJTrans";
import ListDetailBarangMasuk from "layouts/barang-masuk/list-barang-masuk/DetailBarangMasuk";
import DetailBarang from "layouts/dashboard/detail-barang";
import ListSuratJalanByHkeluar from "layouts/surat-jalan/list-surat-jalan-by-hkeluar";
import DetailBarangPemusnahan from "layouts/pemusnahan-barang/approval-pemusnahan-barang/DetailBarangPemusnahan";
import ListTempatBarang from "layouts/penempatan-barang/list-tempat-barang";
import DetailStokOpname from "layouts/stok-opname/detail-stok-opname";
import DetailReportPengirimanBarang from "layouts/report/pengiriman-barang/DetailReportPengiriman";
import DetailBarangByGudang from "layouts/dashboard/dashboard-admin/detailBarangByGudang";
import DetailListBarangRusak from "layouts/barang-rusak/detail-list-rusak";
import DetailPenyesuaian from "layouts/stok-opname/detail-penyesuaian";
import ListSuratJalanByHtransfer from "layouts/surat-jalan/list-surat-jalan-by-htransfer";
import ListBarangMasuk from "layouts/barang-masuk/list-barang-masuk";

import BillingInformation from "layouts/billing/components/BillingInformation";
import DetailPermintaanBarang from "layouts/permintaan-barang/list-permintaan-barang/detail-permintaan-barang";
import { jwtDecode } from "jwt-decode";
import GenerateSuratJalan from "layouts/surat-jalan/generate-surat-jalan";
import GenerateSuratJalanByHkeluar from "layouts/surat-jalan/generate-surat-jalan-byhkeluar";
import DetailPackaging from "layouts/packaging-last/detail-packaging";
import GenerateSuratJalanByHtrans from "layouts/surat-jalan/generate-surat-jalan-byhtrans";
import { MaterialUIControllerProvider } from "context";

const getFilteredRoutes = (allRoutes, userRole, userGudang) => {
  const filteredRoutes = allRoutes
    .map((route) => {
      if (route.type === "collapse" && Array.isArray(route.children)) {
        const filteredChildren = route.children.filter(
          (child) =>
            child.roles &&
            child.roles.includes(userRole) &&
            (!child.jenis_gudang || child.jenis_gudang.includes(userGudang))
        );
        return {
          ...route,
          children: filteredChildren,
        };
      } else if (
        route.roles &&
        route.roles.includes(userRole) &&
        (!route.jenis_gudang || route.jenis_gudang.includes(userGudang))
      ) {
        return route;
      }
      return null;
    })
    .filter((route) => route !== null);

  return filteredRoutes;
};

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const accessToken = localStorage.getItem("access_token");
  let jenisGudang;
  if (accessToken) {
    jenisGudang = jwtDecode(accessToken);
  }

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Tahu POO Kediri"
              routes={getFilteredRoutes(
                routes,
                localStorage.getItem("role_id"),
                localStorage.getItem("jenis_gudang")
              )}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
          </>
        )}
        <Routes>
          {getRoutes(routes)}
          <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
          <Route path="/detail-barang/:dataId/:gudangId?" element={<DetailBarang />} />
          <Route path="/dashboard/:dataId/:gudangId?" element={<DetailBarang />} />
          <Route path="/list-barang-keluar/:dataId" element={<DetailData />} />
          <Route path="/list-surat-jalan/:dataId" element={<DetailSJ />} />
          <Route path="/list-barang-masuk/:dataId" element={<DetailBarangMasuk />} />
          <Route path="/list-mutasi-barang/:dataId" element={<DetailMB />} />
          <Route path="/detailsurat-jalan/transferbarang/:dataId" element={<DetailSJTrans />} />
          <Route path="/list-detailbarang-masuk/:dataId" element={<ListDetailBarangMasuk />} />
          <Route path="/list-suratjalan-by-hkeluar/:dataId" element={<ListSuratJalanByHkeluar />} />
          <Route
            path="/list-suratjalan-by-htransfer/:dataId"
            element={<ListSuratJalanByHtransfer />}
          />
          <Route path="/list-pemusnahan-barang/:dataId" element={<DetailBarangPemusnahan />} />
          <Route path="/list-tempat-barang/:dataId/:gudangId?" element={<ListTempatBarang />} />
          <Route path="/stok-opname/:dataId" element={<DetailStokOpname />} />
          <Route path="/dashboard-admin/:dataId" element={<DetailBarangByGudang />} />
          <Route
            path="/pengiriman-barang/:dataId/:dateAwal/:dateAkhir"
            element={<DetailReportPengirimanBarang />}
          />
          <Route path="/list-barang-rusak/:dataId" element={<DetailListBarangRusak />} />
          <Route path="/detail-penyesuaian/:dataId" element={<DetailPenyesuaian />} />
          <Route path="/list-permintaan-barang/:dataId" element={<DetailPermintaanBarang />} />

          {/* Untuk report pergerakan barang */}
          <Route
            path="/list-pemusnahan-barang/pergerakan-barang/:dataId"
            element={<DetailBarangPemusnahan />}
          />
          <Route path="/list-barang-keluar/pergerakan-barang/:dataId" element={<DetailData />} />
          <Route
            path="/list-barang-masuk/pergerakan-barang/:dataId"
            element={<DetailBarangMasuk />}
          />
          <Route path="/list-mutasi-barang/pergerakan-barang/:dataId" element={<DetailMB />} />
          <Route
            path="/list-barang-rusak/pergerakan-barang/:dataId"
            element={<DetailListBarangRusak />}
          />
          {/* End report pergerakan barang */}

          {/* Untuk report Penerimaan Barang */}
          <Route path="/penerimaan-barang/:dataId" element={<ListDetailBarangMasuk />} />
          {/* End Report Penerimaan Barang */}

          {/* Create Surat Jalan */}
          <Route path="/create-surat-jalan/:dataId" element={<GenerateSuratJalanByHkeluar />} />
          <Route
            path="/create-surat-jalan-trans/:dataId"
            element={<GenerateSuratJalanByHtrans />}
          />
          {/* End Create Surat Jalan */}

          {/* Detail packaging */}
          <Route path="/detail-packaging/:dataId" element={<DetailPackaging />} />
          {/* End Detail Packaging */}
        </Routes>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

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

import BillingInformation from "layouts/billing/components/BillingInformation";

// const getFilteredRoutes = (allRoutes, userRole) => {
//   const filteredRoutes = allRoutes.filter((route) => {
//     if (route.collapse) {
//       route.collapse = getFilteredRoutes(route.collapse, userRole);
//       return route.collapse.length > 0;
//     }

//     if (route.roles) {
//       return route.roles.includes(userRole);
//     }

//     return true;
//   });

//   return filteredRoutes;
// };

const getFilteredRoutes = (allRoutes, userRole) => {
  const filteredRoutes = allRoutes
    .map((route) => {
      if (route.type === "collapse" && Array.isArray(route.children)) {
        const filteredChildren = route.children.filter(
          (child) => child.roles && child.roles.includes(userRole)
        );
        return {
          ...route,
          children: filteredChildren,
        };
      } else if (route.roles && route.roles.includes(userRole)) {
        return route;
      }
      return null; // Filter out routes that don't match the user role
    })
    .filter((route) => route !== null); // Filter out null routes

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
              routes={getFilteredRoutes(routes, localStorage.getItem("role_id"))}
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
          <Route path="/detail/:dataId" element={<DetailData />} />
          <Route path="/detailsurat-jalan/:dataId" element={<DetailSJ />} />
          <Route path="/detailbarang-masuk/:dataId" element={<DetailBarangMasuk />} />
          <Route path="/detailmutasi-barang/:dataId" element={<DetailMB />} />
          <Route path="/detailsurat-jalan/transferbarang/:dataId" element={<DetailSJTrans />} />
          <Route path="/list-detailbarang-masuk/:dataId" element={<ListDetailBarangMasuk />} />
          <Route path="/list-suratjalan-by-hkeluar/:dataId" element={<ListSuratJalanByHkeluar />} />
          <Route path="/detail-pemusnahan-barang/:dataId" element={<DetailBarangPemusnahan />} />
          <Route path="/list-tempat-barang/:dataId/:gudangId?" element={<ListTempatBarang />} />
          <Route path="/detail-stok-opname/:dataId" element={<DetailStokOpname />} />
          <Route path="/detail-barang-by-gudang/:dataId" element={<DetailBarangByGudang />} />
          <Route
            path="/detail-report-pengiriman-barang/:dataId/:dateAwal/:dateAkhir"
            element={<DetailReportPengirimanBarang />}
          />
          <Route path="/detail-list-barang-rusak/:dataId" element={<DetailListBarangRusak />} />
          <Route path="/detail-penyesuaian/:dataId" element={<DetailPenyesuaian />} />
        </Routes>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

// kalau sidenav tidak keluar pakai yang dibawah

// export default function App() {
//   const [controller, dispatch] = useMaterialUIController();
//   const {
//     miniSidenav,
//     direction,
//     layout,
//     openConfigurator,
//     sidenavColor,
//     transparentSidenav,
//     whiteSidenav,
//     darkMode,
//   } = controller;
//   const [onMouseEnter, setOnMouseEnter] = useState(false);
//   const [rtlCache, setRtlCache] = useState(null);
//   const { pathname } = useLocation();

//   // Cache for the rtl
//   useMemo(() => {
//     const cacheRtl = createCache({
//       key: "rtl",
//       stylisPlugins: [rtlPlugin],
//     });

//     setRtlCache(cacheRtl);
//   }, []);

//   // Open sidenav when mouse enter on mini sidenav
//   const handleOnMouseEnter = () => {
//     if (miniSidenav && !onMouseEnter) {
//       setMiniSidenav(dispatch, false);
//       setOnMouseEnter(true);
//     }
//   };

//   // Close sidenav when mouse leave mini sidenav
//   const handleOnMouseLeave = () => {
//     if (onMouseEnter) {
//       setMiniSidenav(dispatch, true);
//       setOnMouseEnter(false);
//     }
//   };

//   // Change the openConfigurator state
//   const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

//   // Setting the dir attribute for the body element
//   useEffect(() => {
//     document.body.setAttribute("dir", direction);
//   }, [direction]);

//   // Setting page scroll to 0 when changing the route
//   useEffect(() => {
//     document.documentElement.scrollTop = 0;
//     document.scrollingElement.scrollTop = 0;
//   }, [pathname]);

//   const getRoutes = (allRoutes) =>
//     allRoutes.map((route) => {
//       if (route.collapse) {
//         return getRoutes(route.collapse);
//       }

//       if (route.route) {
//         return <Route exact path={route.route} element={route.component} key={route.key} />;
//       }

//       return null;
//     });

//   const configsButton = (
//     <MDBox
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       width="3.25rem"
//       height="3.25rem"
//       bgColor="white"
//       shadow="sm"
//       borderRadius="50%"
//       position="fixed"
//       right="2rem"
//       bottom="2rem"
//       zIndex={99}
//       color="dark"
//       sx={{ cursor: "pointer" }}
//       onClick={handleConfiguratorOpen}
//     >
//       <Icon fontSize="small" color="inherit">
//         settings
//       </Icon>
//     </MDBox>
//   );

//   return direction === "rtl" ? (
//     <CacheProvider value={rtlCache}>
//       <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
//         <CssBaseline />
//         {layout === "dashboard" && (
//           <>
//             <Sidenav
//               color={sidenavColor}
//               brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
//               brandName="PT. Eka Artha Buana"
//               routes={routes}
//               onMouseEnter={handleOnMouseEnter}
//               onMouseLeave={handleOnMouseLeave}
//             />
//             <Configurator />
//             {configsButton}
//           </>
//         )}
//         {layout === "vr" && <Configurator />}
//         <Routes>
//           {getRoutes(routes)}
//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </ThemeProvider>
//     </CacheProvider>
//   ) : (
//     <ThemeProvider theme={darkMode ? themeDark : theme}>
//       <CssBaseline />
//       {layout === "dashboard" && (
//         <>
//           <Sidenav
//             color={sidenavColor}
//             brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
//             brandName="PT. Eka Artha Buana"
//             routes={routes}
//             onMouseEnter={handleOnMouseEnter}
//             onMouseLeave={handleOnMouseLeave}
//           />
//           <Configurator />
//           {configsButton}
//         </>
//       )}
//       {layout === "vr" && <Configurator />}
//       <Routes>
//         {getRoutes(routes)}
//         <Route path="*" element={<Navigate to="/dashboard" />} />
//       </Routes>
//     </ThemeProvider>
//   );
// }

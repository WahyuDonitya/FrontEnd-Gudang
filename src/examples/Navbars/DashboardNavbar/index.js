// import { useState, useEffect } from "react";
// import axios from "axios";

// // react-router components
// import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";

// // prop-types is a library for typechecking of props.
// import PropTypes from "prop-types";

// // @material-ui core components
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import Icon from "@mui/material/Icon";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDInput from "components/MDInput";

// // Material Dashboard 2 React example components
// import Breadcrumbs from "examples/Breadcrumbs";
// import NotificationItem from "examples/Items/NotificationItem";

// // Custom styles for DashboardNavbar
// import {
//   navbar,
//   navbarContainer,
//   navbarRow,
//   navbarIconButton,
//   navbarMobileMenu,
// } from "examples/Navbars/DashboardNavbar/styles";

// // Material Dashboard 2 React context
// import {
//   useMaterialUIController,
//   setTransparentNavbar,
//   setMiniSidenav,
//   setOpenConfigurator,
// } from "context";
// import { jwtDecode } from "jwt-decode";
// import MDTypography from "components/MDTypography";

// function DashboardNavbar({ absolute, light, isMini }) {
//   const navigate = useNavigate();
//   const [navbarType, setNavbarType] = useState();
//   const [controller, dispatch] = useMaterialUIController();
//   const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
//   const [openMenu, setOpenMenu] = useState(false);
//   const route = useLocation().pathname.split("/").slice(1);
//   const [pengguna, setPengguna] = useState(null);
//   const [gudang, setGudang] = useState(null);

//   const accessToken = localStorage.getItem("access_token");
//   let decode = null;
//   if (accessToken) {
//     decode = jwtDecode(accessToken);
//   }

//   const getGudang = async () => {
//     try {
//       const response = await axios.get(`https://api.tahupoosby.com/api/gudang/${decode.gudang_id}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       setGudang(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getPengguna = async () => {
//     try {
//       const response = await axios.get(`https://api.tahupoosby.com/api/pengguna/${decode.pengguna_id}`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       setPengguna(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getGudang();
//     getPengguna();
//   }, []);

//   useEffect(() => {
//     getGudang();
//     getPengguna();
//     // Setting the navbar type
//     if (fixedNavbar) {
//       setNavbarType("sticky");
//     } else {
//       setNavbarType("static");
//     }

//     // A function that sets the transparent state of the navbar.
//     function handleTransparentNavbar() {
//       setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
//     }

//     /**
//      The event listener that's calling the handleTransparentNavbar function when
//      scrolling the window.
//     */
//     window.addEventListener("scroll", handleTransparentNavbar);

//     // Call the handleTransparentNavbar function to set the state with the initial value.
//     handleTransparentNavbar();
//     // Remove event listener on cleanup
//     return () => window.removeEventListener("scroll", handleTransparentNavbar);
//   }, [dispatch, fixedNavbar]);

//   const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
//   const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
//   const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
//   const handleCloseMenu = () => setOpenMenu(false);

//   // Render the notifications menu
//   const renderMenu = () => (
//     <Menu
//       anchorEl={openMenu}
//       anchorReference={null}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "left",
//       }}
//       open={Boolean(openMenu)}
//       onClose={handleCloseMenu}
//       sx={{ mt: 2 }}
//     >
//       <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
//       <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
//       <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
//     </Menu>
//   );

//   // Styles for the navbar icons
//   const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
//     color: () => {
//       let colorValue = light || darkMode ? white.main : dark.main;

//       if (transparentNavbar && !light) {
//         colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
//       }

//       return colorValue;
//     },
//   });

//   const handleLogout = async () => {
//     try {
//       const accessToken = localStorage.getItem("access_token");
//       // console.log("dari local storage", accessToken);

//       await axios.post(
//         "https://api.tahupoosby.com/api/logout",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("role_id");
//       navigate("/authentication/sign-in");
//     } catch (error) {
//       console.error("Terjadi kesalahan saat logout:", error);
//     }
//   };

//   return (
//     <AppBar
//       position={absolute ? "absolute" : navbarType}
//       color="inherit"
//       sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
//     >
//       <Toolbar sx={(theme) => navbarContainer(theme)}>
//         <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
//           <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
//         </MDBox>
//         {isMini ? null : (
//           <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
//             <MDBox pr={1}>{/* <MDTypography>${pengguna.pengguna_username}</MDTypography> */}</MDBox>
//             <MDBox color={light ? "white" : "inherit"}>
//               <IconButton
//                 size="small"
//                 disableRipple
//                 color="inherit"
//                 sx={navbarMobileMenu}
//                 onClick={handleMiniSidenav}
//               >
//                 <Icon sx={iconsStyle} fontSize="medium">
//                   {miniSidenav ? "menu_open" : "menu"}
//                 </Icon>
//               </IconButton>

//               {/* Untuk Logout */}
//               <IconButton
//                 size="small"
//                 disableRipple
//                 color="inherit"
//                 sx={navbarIconButton}
//                 onClick={handleLogout}
//               >
//                 <Icon sx={iconsStyle}>logout</Icon>
//               </IconButton>
//             </MDBox>
//           </MDBox>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// }

// // Setting default values for the props of DashboardNavbar
// DashboardNavbar.defaultProps = {
//   absolute: false,
//   light: false,
//   isMini: false,
// };

// // Typechecking props for the DashboardNavbar
// DashboardNavbar.propTypes = {
//   absolute: PropTypes.bool,
//   light: PropTypes.bool,
//   isMini: PropTypes.bool,
// };

// export default DashboardNavbar;

import { useState, useEffect } from "react";
import axios from "axios";

// react-router components
import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { jwtDecode } from "jwt-decode";
import MDTypography from "components/MDTypography";

function DashboardNavbar({ absolute, light, isMini }) {
  const navigate = useNavigate();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [pengguna, setPengguna] = useState(null);
  const [gudang, setGudang] = useState(null);
  const [loading, setLoading] = useState(true); // State untuk mengelola status pemanggilan API

  const accessToken = localStorage.getItem("access_token");
  let decode = null;
  if (accessToken) {
    decode = jwtDecode(accessToken);
  }

  const getGudang = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/gudang/${decode.gudang_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setGudang(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPengguna = async () => {
    try {
      const response = await axios.get(
        `https://api.tahupoosby.com/api/pengguna/${decode.pengguna_id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setPengguna(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getGudang();
      await getPengguna();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();
    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      // console.log("dari local storage", accessToken);

      await axios.post(
        "https://api.tahupoosby.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      localStorage.removeItem("access_token");
      localStorage.removeItem("role_id");
      navigate("/authentication/sign-in");
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {!loading && pengguna && (
              <MDBox pr={1}>
                <MDTypography variant="caption">
                  {`Halo, ${pengguna.pengguna_nama} (${
                    gudang ? gudang.data.gudang_nama : "Admin"
                  })`}
                </MDTypography>
              </MDBox>
            )}
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>

              {/* Untuk Logout */}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleLogout}
              >
                <Icon sx={iconsStyle}>logout</Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;

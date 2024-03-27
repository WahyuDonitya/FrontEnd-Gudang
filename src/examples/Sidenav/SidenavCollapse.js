import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";

function SidenavCollapse({ icon, name, active, children, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [open, setOpen] = useState(false);

  // Function to handle the toggle of the collapse
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem component="li" onClick={handleToggle}>
        <MDBox
          {...rest}
          sx={(theme) =>
            collapseItem(theme, {
              active,
              transparentSidenav,
              whiteSidenav,
              darkMode,
              sidenavColor,
            })
          }
        >
          <ListItemIcon
            sx={(theme) =>
              collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
            }
          >
            {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) =>
              collapseText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              })
            }
          />
        </MDBox>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div style={{ paddingLeft: "10px" }}>{children}</div>
      </Collapse>
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SidenavCollapse;

// import React, { useState } from "react";
// import PropTypes from "prop-types";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Icon from "@mui/material/Icon";
// import MDBox from "components/MDBox";
// import {
//   collapseItem,
//   collapseIconBox,
//   collapseIcon,
//   collapseText,
// } from "examples/Sidenav/styles/sidenavCollapse";
// import { useMaterialUIController } from "context";
// import Collapse from "@mui/material/Collapse";

// function SidenavCollapse({ icon, name, children, ...rest }) {
//   const [controller] = useMaterialUIController();
//   const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

//   // State to manage the open/close state of the collapse
//   const [open, setOpen] = useState(false);

//   // Function to handle the toggle of the collapse
//   const handleToggle = () => {
//     setOpen(!open);
//   };

//   return (
//     <>
//       <ListItem button onClick={handleToggle} component="li">
//         <MDBox
//           {...rest}
//           sx={(theme) =>
//             collapseItem(theme, {
//               active: open,
//               transparentSidenav,
//               whiteSidenav,
//               darkMode,
//               sidenavColor,
//             })
//           }
//         >
//           <ListItemIcon
//             sx={(theme) =>
//               collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active: open })
//             }
//           >
//             {typeof icon === "string" ? (
//               <Icon sx={(theme) => collapseIcon(theme, { active: open })}>{icon}</Icon>
//             ) : (
//               icon
//             )}
//           </ListItemIcon>
//           <ListItemText
//             primary={name}
//             sx={(theme) =>
//               collapseText(theme, {
//                 miniSidenav,
//                 transparentSidenav,
//                 whiteSidenav,
//                 active: open,
//               })
//             }
//           />
//         </MDBox>
//       </ListItem>
//       <Collapse in={open} timeout="auto" unmountOnExit>
//         {children}
//       </Collapse>
//     </>
//   );
// }

// // Setting default values for the props of SidenavCollapse
// SidenavCollapse.defaultProps = {
//   active: false,
// };

// // Typechecking props for the SidenavCollapse
// SidenavCollapse.propTypes = {
//   icon: PropTypes.node.isRequired,
//   name: PropTypes.string.isRequired,
//   children: PropTypes.node.isRequired,
// };

// export default SidenavCollapse;

// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Icon from "@mui/material/Icon";
// import MDBox from "components/MDBox";
// import {
//   collapseItem,
//   collapseIconBox,
//   collapseIcon,
//   collapseText,
// } from "examples/Sidenav/styles/sidenavCollapse";
// import { useMaterialUIController } from "context";
// import Collapse from "@mui/material/Collapse";

// function SidenavCollapse({ icon, name, isActive, children, ...rest }) {
//   const [controller] = useMaterialUIController();
//   const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

//   // State to manage the open/close state of the collapse
//   const [open, setOpen] = useState(isActive);

//   useEffect(() => {
//     // Set the open state based on isActive prop
//     setOpen(isActive);
//   }, [isActive]);

//   // Function to handle the toggle of the collapse
//   const handleToggle = () => {
//     setOpen(!open);
//   };

//   return (
//     <>
//       <ListItem button onClick={handleToggle} component="li">
//         <MDBox
//           {...rest}
//           sx={(theme) =>
//             collapseItem(theme, {
//               active: open,
//               transparentSidenav,
//               whiteSidenav,
//               darkMode,
//               sidenavColor,
//             })
//           }
//         >
//           <ListItemIcon
//             sx={(theme) =>
//               collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active: open })
//             }
//           >
//             {typeof icon === "string" ? (
//               <Icon sx={(theme) => collapseIcon(theme, { active: open })}>{icon}</Icon>
//             ) : (
//               icon
//             )}
//           </ListItemIcon>
//           <ListItemText
//             primary={name}
//             sx={(theme) =>
//               collapseText(theme, {
//                 miniSidenav,
//                 transparentSidenav,
//                 whiteSidenav,
//                 active: open,
//               })
//             }
//           />
//         </MDBox>
//       </ListItem>
// <Collapse in={open} timeout="auto" unmountOnExit>
//   {children}
// </Collapse>
//     </>
//   );
// }

// // Setting default values for the props of SidenavCollapse
// SidenavCollapse.defaultProps = {
//   active: false,
//   isActive: false,
// };

// // Typechecking props for the SidenavCollapse
// SidenavCollapse.propTypes = {
//   icon: PropTypes.node.isRequired,
//   name: PropTypes.string.isRequired,
//   isActive: PropTypes.bool, // Properti baru untuk menandakan apakah item ini aktif atau tidak
//   children: PropTypes.node.isRequired,
// };

// export default SidenavCollapse;

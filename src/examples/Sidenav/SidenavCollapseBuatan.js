// SidenavCollapse.js

import React, { useState } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemIcon, ListItemText, Collapse, Icon } from "@mui/material";
import { NavLink } from "react-router-dom";

function SidenavCollapseBuatan({ icon, name, collapse }) {
  const [open, setOpen] = useState(false);

  const handleCollapse = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem onClick={handleCollapse}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
        <Icon>{open ? "expand_less" : "expand_more"}</Icon>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {collapse.map((child) => (
          <ListItem
            key={child.key}
            component={NavLink}
            to={child.route}
            activeClassName="Mui-selected"
          >
            <ListItemIcon>{child.icon}</ListItemIcon>
            <ListItemText primary={child.name} />
          </ListItem>
        ))}
      </Collapse>
    </>
  );
}

SidenavCollapseBuatan.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  collapse: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default SidenavCollapseBuatan;

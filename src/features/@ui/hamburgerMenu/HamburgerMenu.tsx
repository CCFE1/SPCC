import React, { useState } from "react";
import DrawerList from "../drawerList/DrawerList";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./HamburgerMenu.module.css";
import { Drawer, IconButton } from "@mui/material";

import {
  userOptions,
  adminOptions,
  bottomListOptions,
} from "./HamburgerMenuOptions";

export default function HamburgerMenu() {
  const [state, setState] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  return (
    <nav className={styles.nav}>
      <IconButton aria-label="menu" size="large" onClick={toggleDrawer(true)}>
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
        <DrawerList
          anchor="left"
          toggleDrawer={toggleDrawer}
          topList={adminOptions}
          bottomList={bottomListOptions}
        />
      </Drawer>
    </nav>
  );
}

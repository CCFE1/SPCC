import Link from "next/link";
import Icon from "@mui/material/Icon";
import type { DrawerListProps } from "@models/interfaces";

import {
  Box,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export default function DrawerList(props: DrawerListProps) {
  return (
    <Box
      sx={{
        width:
          props.anchor === "top" || props.anchor === "bottom" ? "auto" : 250,
      }}
      role="presentation"
      onClick={props.toggleDrawer(false)}
      onKeyDown={props.toggleDrawer(false)}
    >
      <List>
        {props.topList.map((item, index) => (
          <Link key={index} href={item.link} passHref>
            <ListItem key={item.label} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon>{item.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      {props.bottomList && (
        <List>
          {props.bottomList.map((item, index) => (
            <Link key={index} href={item.link} passHref>
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={item.action}>
                  <ListItemIcon>
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      )}
    </Box>
  );
}

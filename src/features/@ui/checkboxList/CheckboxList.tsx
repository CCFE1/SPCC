import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import type { CheckboxListProps, Tag } from "@models/interfaces";

export default function CheckboxList(props: CheckboxListProps) {
  const [checked, setChecked] = useState<Tag[]>(props.itemList);

  const handleToggle = (item: Tag) => () => {
    const currentIndex = checked.findIndex((tag) => tag?.id === item?.id);
    const newChecked = [...checked];
    const { callback } = props;

    if (currentIndex === -1) {
      newChecked.push(item);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    callback(newChecked);
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        paddingTop: 0,
        paddingBottom: 0,
        height: `${4 * 50}px`,
        maxHeight: `${4 * 50}px`,
      }}
    >
      {props.itemList.map((item: Tag, index: number) => {
        const labelId = `checkbox-list-label-${item.label}`;

        return (
          <ListItem key={index} disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(item)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.findIndex((tag) => tag?.id === item?.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${item.label} (${item.value})`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

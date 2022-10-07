import React, { useState } from "react";
import uuid from "react-uuid";
import AddIcon from "@material-ui/icons/Add";
import {
  Container,
  FormControl,
  TextField,
  makeStyles,
} from "@material-ui/core";

import { TodoItem } from "../../types";

export interface AddProps {
  addItem: (item: TodoItem | TodoItem[]) => void;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
  },
  plusIcon: {
    margin: "5px 10px 0px 8px",
  },
});

export const Form = (props: AddProps) => {
  const classes = useStyles();
  const { addItem } = props;
  const [itemName, setItemName] = useState("");

  return (
    <Container className={classes.root}>
      <AddIcon className={classes.plusIcon} />
      <FormControl fullWidth>
        <TextField
          onPaste={(e) => {
            // Stop data actually being pasted into div
            e.stopPropagation();
            e.preventDefault();

            // Get pasted data via clipboard API
            const clipboardData = e.clipboardData;
            const pastedData = clipboardData
              .getData("Text")
              .split("\n")
              .reverse()
              .filter((name) => name.trim() !== "");

            // Do whatever with pasteddata
            const items = pastedData.map((name) => {
              return { name, uuid: uuid(), isComplete: false };
            });
            addItem(items);
          }}
          onChange={(e) => {
            addItem({
              name: e.target.value,
              uuid: uuid(),
              isComplete: false,
            });
            setItemName("");
          }}
          placeholder="Add item."
          value={itemName}
          className="w-10/12"
          autoFocus
        />
      </FormControl>
    </Container>
  );
};

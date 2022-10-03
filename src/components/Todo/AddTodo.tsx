import React, { FC, useState } from "react";
import { Container, TextField, FormControl } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import uuid from "react-uuid";

import type { TodoItem } from "./types";
import useTodoStyles from "./useTodoStyles";

export interface AddProps {
  addItem: (item: TodoItem | TodoItem[]) => void;
}

const AddTodo: FC<AddProps> = ({ addItem }) => {
  const classes = useTodoStyles();
  const [itemName, setItemName] = useState("");

  return (
    <Container className={classes.root}>
      <AddIcon titleAccess="Create Todo" className={classes.plusIcon} />{" "}
      <FormControl fullWidth>
        <TextField
          onPaste={(e) => {
            let clipboardData, pastedData;

            // Stop data actually being pasted into div
            e.stopPropagation();
            e.preventDefault();

            // Get pasted data via clipboard API
            clipboardData = e.clipboardData;
            pastedData = clipboardData
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
            addItem({ name: e.target.value, uuid: uuid(), isComplete: false });
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

export default AddTodo;

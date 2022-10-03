import React, { FC, useEffect, useRef, useState } from "react";
import { Checkbox, Container, TextField, FormControl } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import uuid from "react-uuid";

import type { TodoItem } from "./types";
import useTodoStyles from "./useTodoStyles";

interface Props {
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  addItem: (item: TodoItem | TodoItem[]) => void;
  itemIndex: number;
}

const TodoListItem: FC<Props> = ({
  items,
  setItemsCallback,
  itemIndex,
  addItem,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const classes = useTodoStyles();
  const [itemText, setItemText] = useState("");

  useEffect(() => {
    items[itemIndex].name.length < 2 &&
      inputRef.current &&
      inputRef.current?.focus();
    setItemText(items[itemIndex].name);
  }, []);

  if (items[itemIndex].isComplete) return null;
  return (
    <Container className={classes.root}>
      <Checkbox
        title="Mark as completed"
        onChange={(e) => {
          items[itemIndex].isComplete = true;
          setItemsCallback([...items]);
        }}
      />
      <FormControl fullWidth>
        <TextField
          className={classes.textFeild}
          InputProps={{ classes: { underline: classes.underline } }}
          inputRef={inputRef}
          value={itemText} // innerHTML of the editable div
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
            items[itemIndex].name = e.target.value;
            setItemText(e.target.value);
          }}
          onBlur={(e) => {
            setItemsCallback([...items]);
          }}
          onKeyPress={(e) =>
            e.key === "Enter" &&
            itemIndex < 1 &&
            addItem({ name: "", uuid: uuid(), isComplete: false })
          }
        />
      </FormControl>
      <CloseIcon
        titleAccess="Delete Todo"
        className={classes.closeIcon}
        onClick={(e) => {
          items.splice(itemIndex, 1);
          setItemsCallback([...items]);
        }}
      />
    </Container>
  );
};

export default TodoListItem;

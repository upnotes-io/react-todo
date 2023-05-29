import React, { useState, useRef } from "react";
import clsx from 'clsx';
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
  addItem: (
    item: TodoItem | TodoItem[],
    cursorLocation?: number | null | undefined
  ) => void;
  changeFocus: (focusIndex: number) => void;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
  },
  plusIcon: {
    margin: "5px 10px 0px 8px",
  },
  iconStyle: {
    padding: 8,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: 100,
    },
  },
});

export const Form = (props: AddProps) => {
  const classes = useStyles();
  const { addItem, changeFocus } = props;
  const [itemName, setItemName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container className={classes.root}>
      <AddIcon
        className={clsx(classes.iconStyle, classes.plusIcon)}
        onClick={() => {
          addItem({
            name: itemName,
            uuid: uuid(),
            isComplete: false,
          });
          setItemName("");
        }}
      />
      <FormControl fullWidth>
        <TextField
          inputRef={inputRef}
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
            changeFocus(items.length - 1);
          }}
          onChange={(e) => {
            setItemName(e.target.value);
          }}
          placeholder="Add item."
          value={itemName}
          className="w-10/12"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem({
                name: itemName,
                uuid: uuid(),
                isComplete: false,
              });
              setItemName("");
            }
            if (e.key === "ArrowDown") {
              // Move cursor down to the next item
              const inputs = document.querySelectorAll("input[type='text']");
              const inputsArray = Array.from(inputs);
              const index = inputsArray.indexOf(
                inputRef.current as HTMLInputElement
              );

              // Checks if the focused item is at the bottom
              if (index < inputsArray.length - 1) {
                const nextInputElement = inputsArray[
                  index + 1
                ] as HTMLInputElement;

                nextInputElement.focus();
              }
            }
          }}
        />
      </FormControl>
    </Container>
  );
};

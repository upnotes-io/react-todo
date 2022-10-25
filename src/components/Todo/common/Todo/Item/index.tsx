import React, {
  FC,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import uuid from 'react-uuid';
import {
  Checkbox,
  Container,
  FormControl,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { Reorder, useMotionValue } from 'framer-motion';
import CloseIcon from '@material-ui/icons/Close';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import useRaisedShadow from './useRaisedShadow';
import { TodoItem } from '../../types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    zIndex: 0,
  },
  underline: {
    '&&&:before': {
      borderBottom: 'none',
    },
  },
  textFeild: {
    padding: '10px 0px 7px',
  },
  dragIndicatorIcon: {
    cursor: 'grab',
  },
  closeIcon: {
    cursor: 'pointer',
    padding: '2px',
    '&:hover': {
      backgroundColor: '#b9b5b5',
      borderRadius: '50%',
    },
  },
  reorderItem: {
    listStyle: 'none',
    position: 'relative',
    backgroundColor: 'white',
  },
});

interface Props {
  items: TodoItem[];
  itemIndex: number;
  addItem: (item: TodoItem | TodoItem[]) => void;
  setItemsCallback: (updatedItems: TodoItem[]) => void;
}

export const Item: FC<Props> = ({
  items,
  itemIndex,
  setItemsCallback,
  addItem,
  // handleArrowUpDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const classes = useStyles();

  const [itemText, setItemText] = useState('');
  const [draggable, setDraggable] = useState(false);

  useEffect(() => {
    items[itemIndex].name.length < 2 &&
      inputRef.current &&
      inputRef.current.focus();
    setItemText(items[itemIndex].name);
  }, []);

  useEffect(() => {
    setItemText(items[itemIndex].name);
  }, [items[itemIndex].name]);

  const handleDelete = () => {
    items.splice(itemIndex, 1);
    setItemsCallback([...items]);
  };

  const getNthTodoElement = (n: number) => {
    return (
      document.querySelector<HTMLInputElement>(
        `.${classes.reorderItem}:has(${classes.textFeild}):nth-of-type(${
          n + 1
        }) .${classes.textFeild} input`
      ) ??
      document.querySelectorAll<HTMLInputElement>(
        `.${classes.textFeild} input`
      )[n]
    );
  };

  const handleBackspace = () => {
    if (!itemIndex) return; // Do nothing, for first TODO

    if (inputRef.current!.selectionStart) return; // Do nothing if cursor isn't at start.

    let previousItemElement = getNthTodoElement(itemIndex - 1);

    const previousItem = items.at(itemIndex - 1)!;
    const previousItemName = previousItem.name;

    if (itemText) {
      previousItem.name = `${previousItemName}${previousItemName ? " " : ""}${itemText}`;
    }

    previousItemElement.focus();

    // Focusing the element takes a bit time, so if selection is set synchronously the selection is unset.
    setTimeout(() => {
      // Set the cursor position just before the current item name
      const cursorPos = previousItemName?.length! + Number(!!previousItemName);
      previousItemElement.setSelectionRange(cursorPos, cursorPos);
    }, 0);

    handleDelete();
    return true;
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    switch (e.key) {
      case "Enter": {
        if (itemIndex < 1)
          addItem({ name: "", uuid: uuid(), isComplete: false });
        break;
      }

      case "Backspace": {
        if (handleBackspace()) e.preventDefault();
        break;
      }
    }
    handleArrowKey(e)
  };

  const handleArrowKey : KeyboardEventHandler<HTMLDivElement> = (e) => {
    const inputs = document.querySelectorAll("input[type='text']");
    const inputsArray = Array.from(inputs);
    const index = inputsArray.indexOf(
      inputRef.current as HTMLInputElement
    );

    if (inputRef.current) {
      if (e.key === 'ArrowUp') {
        // Move cursor to the previous item
        // Checks if the focused item is at the top
        if (index >= 0) {
          const nextInputElement = inputsArray[
            index - 1
          ] as HTMLInputElement;
          nextInputElement.focus();
        }
      } else if (e.key === 'ArrowDown') {
        // Move cursor to the next item
        // Checks if the focused item is at the bottom
        if (index < inputsArray.length - 1) {
          const nextInputElement = inputsArray[
            index + 1
          ] as HTMLInputElement;
          nextInputElement.focus();
        }
      }
    }
  }
  if (!items[itemIndex].isComplete) {
    return (
      <Reorder.Item
        value={items[itemIndex]?.uuid}
        className={classes.reorderItem}
        dragListener={draggable}
        onDragEnd={() => setDraggable(false)}
        style={{ boxShadow, y }}
      >
        <Container className={classes.root}>
          <DragIndicatorIcon
            className={classes.dragIndicatorIcon}
            onMouseEnter={() => setDraggable(true)}
            onMouseLeave={() => setDraggable(false)} // retain this for better animation
            onTouchStart={() => setDraggable(true)} // for mobile: need to set draggable to `false` in `onDragEnd` prop, not `onTouchEnd`
          />
          <Checkbox
            onChange={() => {
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
                // Stop data actually being pasted into div
                e.stopPropagation();
                e.preventDefault();

                // Get pasted data via clipboard API
                const clipboardData = e.clipboardData;
                const pastedData = clipboardData
                  .getData('Text')
                  .split('\n')
                  .reverse()
                  .filter((name) => name.trim() !== '');

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
              onBlur={() => {
                setItemsCallback([...items]);
              }}
              onKeyDown={handleKeyDown}
            />
          </FormControl>
          <CloseIcon className={classes.closeIcon} onClick={handleDelete} />
        </Container>
      </Reorder.Item>
    );
  }

  return null;
};

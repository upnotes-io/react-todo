import React, { useState } from "react";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Container,
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import { Reorder } from "framer-motion";
import { Item, TodoCompletedItem } from "./common";
import { Form } from "./common/Todo/Form";
import { TodoItem } from "./common/types";

const useStyles = makeStyles({
  accordion: {
    boxShadow: "none",
    borderTop: "1px solid black",
    marginTop: "20px",
  },
  accordionDetails: {
    display: "block",
    paddingLeft: "0px",
  },
  accordionSummary: {
    paddingLeft: "4.2%",
  },
  reorderItem: {
    listStyle: "none",
  },
});

export interface TodoAppProps {
  defaultItems?: TodoItem[];
  onChange: (items: TodoItem[]) => void;
}

function TodoApp(props: TodoAppProps) {
  const { defaultItems = [], onChange } = props;
  const [items, setItems] = useState<TodoItem[]>(defaultItems);
  const classes = useStyles();
  const setItemsCallback = (updatedItems: TodoItem[]) => {
    setItems(updatedItems);
    onChange(updatedItems);
  };
  const addItem = (item: TodoItem | TodoItem[]) => {
    const itemsCopy = [...items];
    if (Array.isArray(item)) {
      item.forEach((it) => {
        itemsCopy.unshift(it);
      });
      setItemsCallback([...itemsCopy]);
    } else {
      itemsCopy.unshift(item);
      setItemsCallback([...itemsCopy]);
    }
  };
  const completedItems = items.filter((item: TodoItem) => item.isComplete);
  const completedItemsLength = completedItems.length;
  const todoItems = items.filter((item: TodoItem) => !item.isComplete);

  const handleReorderTodoItems = (newOrder: string[]) => {
    const updatedItems = newOrder.reduce(
      (currItems: TodoItem[] = [], itemKey) => {
        const item = todoItems.find((item) => item.uuid === itemKey);
        if (item) {
          currItems.push(item);
        }
        return currItems;
      },
      []
    );
    setItems([...updatedItems, ...completedItems]);
  };

  return (
    <Container>
      <Form addItem={addItem} />
      <Reorder.Group
        axis="y"
        values={items.map((item) => item.uuid)}
        onReorder={handleReorderTodoItems}
      >
        {items.map((item, index) => {
          return (
            <Item
              key={item.uuid}
              items={items}
              addItem={addItem}
              itemIndex={index}
              setItemsCallback={setItemsCallback}
            />
          );
        })}
      </Reorder.Group>
      {completedItemsLength > 0 && (
        <Accordion className={classes.accordion} defaultExpanded={true}>
          <AccordionSummary
            className={classes.accordionSummary}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography> {completedItemsLength} Completed items </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            {items.map((item, index) => {
              return (
                <TodoCompletedItem
                  items={items}
                  key={item.uuid}
                  itemIndex={index}
                  setItemsCallback={setItemsCallback}
                />
              );
            })}
          </AccordionDetails>
        </Accordion>
      )}
    </Container>
  );
}

export default TodoApp;

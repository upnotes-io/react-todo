import React, { FC } from "react";
import {
  Checkbox,
  Container,
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import TodoCompletedListItem from "./TodoCompletedListItem";
import useTodoStyles from "./useTodoStyles";
import { TodoItem } from "./types";

interface Props {
  items: TodoItem[];
  setItemsCallback(updatedItems: TodoItem[]): void;
}

const TodoCompletedList: FC<Props> = ({ items, setItemsCallback }) => {
  const classes = useTodoStyles();
  const completedItemsLength = items.filter(
    (item: TodoItem) => item.isComplete
  ).length;

  if (completedItemsLength > 0) {
    return (
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
              <TodoCompletedListItem
                items={items}
                key={item.uuid}
                itemIndex={index}
                setItemsCallback={setItemsCallback}
              />
            );
          })}
        </AccordionDetails>
      </Accordion>
    );
  }

  return null;
};

export default TodoCompletedList;

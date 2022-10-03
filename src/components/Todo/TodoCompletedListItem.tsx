import React, { FC } from "react";
import { Checkbox, Container, Typography } from "@material-ui/core";

import { TodoItem } from "./types";
import useTodoStyles from "./useTodoStyles";

interface Props {
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  itemIndex: number;
}

const TodoCompletedListItem: FC<Props> = (props) => {
  const { items, setItemsCallback, itemIndex } = props;
  const classes = useTodoStyles();
  if (!items[itemIndex].isComplete) return null;

  return (
    <Container className={classes.root}>
      <Checkbox
        checked
        onChange={(e) => {
          items[itemIndex].isComplete = false;
          setItemsCallback([...items]);
        }}
      />
      <Typography variant="subtitle1" className={classes.subtitle1}>
        {items[itemIndex].name}
      </Typography>
    </Container>
  );
};

export default TodoCompletedListItem;

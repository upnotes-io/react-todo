import React, { FC } from "react";
import { Checkbox, Container, Typography, makeStyles } from "@material-ui/core";
import { TodoItem } from "../../types";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
  },
  subtitle1: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    padding: "10px 0px 7px",
  },
});

export interface Props {
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  itemIndex: number;
}

export const TodoCompletedItem: FC<Props> = ({
  items,
  setItemsCallback,
  itemIndex,
}) => {
  const classes = useStyles();

  if (items[itemIndex].isComplete) {
    return (
      <Container className={classes.root}>
        <Checkbox
          checked
          onChange={() => {
            items[itemIndex].isComplete = false;
            setItemsCallback([...items]);
          }}
        />
        <Typography variant="subtitle1" className={classes.subtitle1}>
          {items[itemIndex].name}
        </Typography>
      </Container>
    );
  }

  return null;
};

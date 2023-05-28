import React, { FC } from "react";
import { Checkbox, Container, makeStyles, Typography } from "@material-ui/core";
import { Accordion } from "../../Accordion";
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

export interface TodoCompletedItemProps {
  items: TodoItem[];
  itemIndex: number;
  onUpdateItem: (data: TodoItem) => void;
}

export const TodoCompletedItem: FC<TodoCompletedItemProps> = ({
  items,
  itemIndex,
  onUpdateItem,
}) => {
  const classes = useStyles();

  if (items[itemIndex].isComplete) {
    return (
			<Container className={classes.root}>
				<Checkbox
					checked
					onChange={() => onUpdateItem({ ...items[itemIndex], isComplete: false })}
				/>
				<Typography variant='subtitle1' className={classes.subtitle1}>
					{items[itemIndex].name}
				</Typography>
			</Container>
		);
  }

  return null;
};

export interface TodoCompletedListProps {
  items: TodoItem[];
  completedItems: TodoItem[];
  onUpdateItem: (data: TodoItem) => void;
}

export const TodoCompletedList: FC<TodoCompletedListProps> = ({
  completedItems,
  items,
  onUpdateItem,
}) => {
  const completedItemsLength = completedItems.length;

  if (completedItemsLength === 0) return null;

  return (
    <Accordion title={`${completedItemsLength} Completed items`}>
      {items.map((item, index) => {
        return (
          <TodoCompletedItem
            items={items}
            key={item.uuid}
            itemIndex={index}
            onUpdateItem={onUpdateItem}
          />
        );
      })}
    </Accordion>
  )
}

import React, { FC } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { 
  Checkbox, 
  Container, 
  makeStyles, 
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from "@material-ui/core";
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

export interface TodoCompletedItemProps {
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  itemIndex: number;
}

export const TodoCompletedItem: FC<TodoCompletedItemProps> = ({
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
  }

  return null;
};


export interface TodoCompletedListProps {
  items: TodoItem[];
  completedItems: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
}

export const TodoCompletedList: FC<TodoCompletedListProps> = ({
  completedItems,
  items,
  setItemsCallback
}) => {
  const classes = useStyles();
  const completedItemsLength = completedItems.length;

  if(completedItemsLength === 0) return null;

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
  )
}

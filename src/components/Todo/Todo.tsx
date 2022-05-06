import React, { useRef, useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Checkbox,
  Container,
  makeStyles,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  FormControl,
} from "@material-ui/core";
//@ts-ignore
import uuid from "react-uuid";
import CloseIcon from "@material-ui/icons/Close";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    // fontWeight: theme.typography.fontWeightRegular,
  },
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
  },
  textFeild: {
    padding: "10px 0px 7px",
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
  closeIcon: {
    margin: "10px 0px 7px",
    cursor: "pointer",
  },
  plusIcon: {
    margin: "5px 10px 0px 8px",
  },
});

export interface TodoItem {
  name: string;
  isComplete: boolean;
  uuid: string;
}

export interface AddProps {
  addItem: (item: TodoItem) => void;
}
const Add = (props: AddProps) => {
  const classes = useStyles();
  const { addItem } = props;
  const [itemName, setItemName] = useState("");

  return (
    <Container className={classes.root}>
      <AddIcon className={classes.plusIcon} />{" "}
      <FormControl fullWidth>
   
        <TextField
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

interface ItemProps {
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  addItem: (item: TodoItem) => void;
  itemIndex: number;
}

const Item = (props: ItemProps) => {
  const { items, setItemsCallback, itemIndex, addItem } = props;
  const inputRef = useRef(null);
  const classes = useStyles();
  const [itemText, setItemText] = useState("");
  useEffect(() => {
    // @ts-ignore
    items[itemIndex].name.length < 2 &&
      inputRef.current &&
      inputRef.current.focus();
    setItemText(items[itemIndex].name);
  }, []);
  if (items[itemIndex].isComplete) return null;

  const handleReorder = () => {};

  return (
    <Container className={classes.root}>
      <Checkbox
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
          onChange={(e) => {
            items[itemIndex].name = e.target.value;
            setItemText(e.target.value);
          }} // handle innerHTML change
          // tagName='article' // Use a custom HTML tag (uses a div by default)
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
        className={classes.closeIcon}
        onClick={(e) => {
          items.splice(itemIndex, 1);
          setItemsCallback([...items]);
        }}
      />{" "}
    </Container>
  );
};

export interface TodoCompletedItemsProp {
  children?: React.ReactNode;
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  itemIndex: number;
}

const TodoCompletedItem: React.FC<TodoCompletedItemsProp> = (props) => {
  const { items, setItemsCallback, itemIndex } = props;
  const classes = useStyles();
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
export interface TodoAppProps {
  defaultItems?: TodoItem[];
  onChange: (items: TodoItem[]) => void;
}
export default (props: TodoAppProps) => {
  const { defaultItems = [], onChange } = props;
  const [items, setItems] = useState<TodoItem[]>(defaultItems);
  const classes = useStyles();
  const setItemsCallback = (updatedItems: TodoItem[]) => {
    setItems(updatedItems);
    onChange(updatedItems);
  };
  const addItem = (item: TodoItem) => {
    items.unshift(item);
    setItemsCallback([...items]);
  };
  const completedItemsLength = items.filter(
    (item: TodoItem) => item.isComplete
  ).length;
  return (
    <DragDropContext
    onDragEnd={(param) => {
      console.log("DROP END");
      const srcI = param.source.index;
      const desI = param.destination?.index;
      if (desI) {
       items.splice(desI, 0, items.splice(srcI, 1)[0]);
      setItems(items); 
      }
    }}
    >
      <Droppable droppableId="droppable-1">
        {(provided, _) => (
          <Container ref={provided.innerRef}{...provided.droppableProps}>
            <Add addItem={addItem} />

            {items.map((item, index) => {
          
              return (
                <Draggable
                  key={item.uuid}
                  draggableId={"draggable-" + item.uuid}
                  index={index}
                >
                  {(provided, _) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
                      <Item
                        items={items}
                        addItem={addItem}
                        key={item.uuid}
                        itemIndex={index}
                        setItemsCallback={setItemsCallback}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {completedItemsLength > 0 && (
              <Accordion className={classes.accordion} defaultExpanded={true}>
                <AccordionSummary
                  className={classes.accordionSummary}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    {" "}
                    {completedItemsLength} Completed items{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  {items.map((item, index) => {
                    console.log("in todocompleted item loop");
                    return (
                      <Draggable
                      key={item.uuid}
                      draggableId={"draggable-" + index}
                      index={index}
                    >
                      {(provided, _) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
                      <TodoCompletedItem
                        items={items}
                        key={item.uuid}
                        itemIndex={index}
                        setItemsCallback={setItemsCallback}
                      >
      
                      </TodoCompletedItem></div>)} 
                </Draggable>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            )}  
            {provided.placeholder}
          </Container>
        )}
      
      </Droppable>
    </DragDropContext>
  );
};

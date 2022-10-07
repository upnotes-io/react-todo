import React, { useRef, useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Container, makeStyles, TextField, Accordion, AccordionDetails, AccordionSummary, Typography, FormControl } from '@material-ui/core';

//@ts-ignore
import uuid from 'react-uuid';
import CloseIcon from '@material-ui/icons/Close';

//csstype
import CSS from 'csstype';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%'
  },
  underline: {
    "&&&:before": {
      borderBottom: "none"
    }
  },
  textFeild: {
    padding: '10px 0px 7px'
  },
  subtitle1: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    padding: '10px 0px 7px'
  },
  accordion: {
    boxShadow: 'none',
    borderTop: '1px solid black',
    marginTop: '20px'
  },
  accordionDetails: {
    display: 'block',
    paddingLeft: '0px'
  },
  accordionSummary: {
    paddingLeft: '4.2%'
  },
  closeIcon: {
    margin: '10px 0px 7px',
    cursor: 'pointer'
  },
  plusIcon: {
    margin: '5px 10px 0px 8px'
  }
});


export interface TodoItem {
  name: string;
  isComplete: boolean;
  uuid: string;
}

export interface AddProps {
  addItem: (item: TodoItem | TodoItem[]) => void;
}
const Add = (props: AddProps) => {
  const classes = useStyles();
  const { addItem } = props;
  const [itemName, setItemName] = useState('');

  return (
    <Container className={classes.root}>
      <AddIcon className={classes.plusIcon} />{' '}
      <FormControl fullWidth >
        <TextField
          onPaste={
            (e) =>{
              let clipboardData, pastedData;

              // Stop data actually being pasted into div
              e.stopPropagation();
              e.preventDefault();
            
              // Get pasted data via clipboard API
              clipboardData = e.clipboardData;
              pastedData = clipboardData.getData('Text').split('\n').reverse().filter((name)=> name.trim() !== "");
            
              // Do whatever with pasteddata
              const items = pastedData.map((name)=> {
                return { name, uuid: uuid(), isComplete: false }
              })
              addItem(items);
            }
          }
          onChange={(e) => {
            addItem({ name: e.target.value, uuid: uuid(), isComplete: false });
            setItemName('');
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
  addItem: (item: TodoItem | TodoItem[]) => void;
  itemIndex: number;
}

//Checkbox component

export function Checkbox(props: any) {
  const [hovered, setHovered] = useState(false)

  function hoverEnterHandler() {
    setHovered(true)
  }
  function hoverLeaveHandler() {
    setHovered(false)
  }

  const checkbox__circle: CSS.Properties  = {
      width: 'fit-content',
      clipPath: 'circle(50% at 50% 50%)',
      padding: '10px',
      transition: '0.3s',
      backgroundColor: `${hovered ? "#fdf0f4dd" : undefined}`
      

  }
  
  const checkbox__square: CSS.Properties  = {
      height: '24px',
      width: '24px',
      borderRadius: '2px',

  }
  
  const checkbox__input: CSS.Properties  = {
    position: 'absolute',
    opacity: '0',
    cursor: 'pointer',

  }

  let checked: CSS.Properties  = {
      fill: '#f50057',
      opacity: `${props.checkedbox ? 1 : 0}`
  }
  
  const unchecked: CSS.Properties  = {
    fill: 'rgb(100, 100, 100)',
    opacity: `${props.checkedbox ? 0 : 1}`
  }

  return (
      <div style={checkbox__circle} onMouseEnter={hoverEnterHandler} onMouseLeave={hoverLeaveHandler}>
    <div style={checkbox__square}>
      <input type="checkbox" id="checkbox" onChange={props.onChangeFunc} style={checkbox__input}/>
      <svg style={{height: '24px', width: '24px'}}>
        <path
          style={checked}
          d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        ></path>
        <path
          style={unchecked}
          d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
        ></path>
      </svg>
    </div>
  </div>
  )
}

const Item = (props: ItemProps) => {
  const { items, setItemsCallback, itemIndex, addItem } = props;
  const inputRef = useRef(null);
  const classes = useStyles();
  const [itemText, setItemText] = useState('');
  useEffect(() => {
    // @ts-ignore
    items[itemIndex].name.length < 2 && inputRef.current && inputRef.current.focus();
    setItemText(items[itemIndex].name);
  }, []);
  if (items[itemIndex].isComplete) return null;
  return (
    <Container className={classes.root} >
      <Checkbox checkedbox={false} onChangeFunc={(e: any) => {
        items[itemIndex].isComplete = true;
        setItemsCallback([...items])
      }}
      />
      <FormControl fullWidth >
        <TextField
          className={classes.textFeild}
          InputProps={{ classes: { underline: classes.underline } }}
          inputRef={inputRef}
          value={itemText} // innerHTML of the editable div
          onPaste={
            (e) =>{
              let clipboardData, pastedData;

              // Stop data actually being pasted into div
              e.stopPropagation();
              e.preventDefault();
            
              // Get pasted data via clipboard API
              clipboardData = e.clipboardData;
              pastedData = clipboardData.getData('Text').split('\n').reverse().filter((name)=> name.trim() !== "");
            
              // Do whatever with pasteddata
              const items = pastedData.map((name)=> {
                return { name, uuid: uuid(), isComplete: false }
              })
              addItem(items);
            }
          }
          onChange={(e) => {
            items[itemIndex].name = e.target.value;
            setItemText(e.target.value);
          }} 
          onBlur={(e) => {
            setItemsCallback([...items])
          }}
          onKeyPress={(e) => e.key === 'Enter' && itemIndex < 1 && addItem({ name: '', uuid: uuid(), isComplete: false })}
        />
      </FormControl>
      <CloseIcon
        className={classes.closeIcon}
        onClick={(e) => {
          items.splice(itemIndex, 1)
          setItemsCallback([...items]);
        }}
      />
    </Container>
  );
};

export interface TodoCompletedItemsProp {
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  itemIndex: number;
}

const TodoCompletedItem = (props: TodoCompletedItemsProp) => {
  const { items, setItemsCallback, itemIndex } = props;
  const classes = useStyles();
  if (!items[itemIndex].isComplete) return null;

  return <Container className={classes.root}>
    <Checkbox checked checkedbox={true} onChangeFunc={(e: any) => {
      items[itemIndex].isComplete = false;
      setItemsCallback([...items])
    }} />
    <Typography variant="subtitle1" className={classes.subtitle1}>
      {items[itemIndex].name}
    </Typography>
  </Container>
}

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
  }
  const addItem = (item: TodoItem | TodoItem[]) => {
    const itemsCopy = [...items];
    if(Array.isArray(item)){
      item.forEach(
        (it)=>{
          itemsCopy.unshift(it);
        }
      )
      setItemsCallback([...itemsCopy])
    }else {
      itemsCopy.unshift(item);
      setItemsCallback([...itemsCopy])  
    }
  };
  const completedItemsLength = items.filter((item: TodoItem) => item.isComplete).length;
  return (
    <Container >
      <Add addItem={addItem} />
      {items.map((item, index) => {
        return <Item items={items} addItem={addItem} key={item.uuid} itemIndex={index} setItemsCallback={setItemsCallback} />
      })}
      {completedItemsLength > 0 &&
        <Accordion className={classes.accordion} defaultExpanded={true}>
          <AccordionSummary
            className={classes.accordionSummary}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography > {completedItemsLength} Completed items </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            {items.map((item, index) => {
              return <TodoCompletedItem items={items} key={item.uuid} itemIndex={index} setItemsCallback={setItemsCallback} />
            })}
          </AccordionDetails>
        </Accordion >
      }
    </Container >
  );
};


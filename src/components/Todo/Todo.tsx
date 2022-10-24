import React, { useState } from "react";
import { Reorder } from "framer-motion";
import { Container, Switch } from "@material-ui/core";

import "./Todo.css";
import { Item, TodoCompletedList } from "./common";
import { Form } from "./common/Todo/Form";
import { TodoItem } from "./common/types";

export interface TodoAppProps {
  defaultItems?: TodoItem[];
  onChange: (items: TodoItem[]) => void;
}

function TodoApp(props: TodoAppProps) {
  const { defaultItems = [], onChange } = props;
  const [items, setItems] = useState<TodoItem[]>(defaultItems);
  
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

  const [theme, setTheme] = useState("light-theme");
  const toggleTheme = ()=>{
    setTheme(prevTheme=>(prevTheme === "light-theme"? "dark-theme" : "light-theme"));
  }

  return (
    <div id={theme} > 
    <Container className="todo-container">
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
      <TodoCompletedList 
        items={items}
        setItemsCallback={setItemsCallback}
        completedItems={completedItems}
      />
      <div className="theme-switch">
        <Switch color="secondary" onChange={toggleTheme}/>
        {theme === "light-theme"? <p>Light Mode</p>: <p>Dark Mode</p>}
        </div>
    </Container>
    </div>
  );
}

export default TodoApp;

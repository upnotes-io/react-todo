import React, { FC, useState } from "react";
import { Container } from "@material-ui/core";

import AddTodo from "./AddTodo";
import TodoListItem from "./TodoListItem";
import TodoCompletedList from "./TodoCompletedList";
import { TodoItem } from "./types";
import TodoList from "./TodoList";

interface Props {
  defaultItems?: TodoItem[];
  onChange: (items: TodoItem[]) => void;
}

const Todo: FC<Props> = ({ defaultItems = [], onChange }) => {
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

  return (
    <Container>
      <AddTodo addItem={addItem} />
      <TodoList
        items={items}
        addItem={addItem}
        setItemsCallback={setItemsCallback}
      />
      <TodoCompletedList items={items} setItemsCallback={setItemsCallback} />
    </Container>
  );
};

export default Todo;

import React, { FC } from "react";

import TodoListItem from "./TodoListItem";
import { TodoItem } from "./types";

interface Props {
  items: TodoItem[];
  setItemsCallback: (updatedItems: TodoItem[]) => void;
  addItem: (item: TodoItem | TodoItem[]) => void;
}

const TodoList: FC<Props> = ({ items, addItem, setItemsCallback }) => {
  return (
    <>
      {items.map((item, index) => {
        return (
          <TodoListItem
            items={items}
            addItem={addItem}
            key={item.uuid}
            itemIndex={index}
            setItemsCallback={setItemsCallback}
          />
        );
      })}
    </>
  );
};

export default TodoList;

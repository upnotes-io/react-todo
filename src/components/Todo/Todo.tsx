import React, { useCallback, useState } from "react";
import { Reorder } from "framer-motion";
import { Container } from "@material-ui/core";

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
  const [focus, setFocus] = useState(-1);

  const setItemsCallback = (updatedItems: TodoItem[]) => {
    setItems(updatedItems);
    onChange(updatedItems);
  };

  const addItem = (
    item: TodoItem | TodoItem[],
    cursorLocation?: number | null | undefined
  ) => {
    console.log("cursor location in add item", cursorLocation);
    const itemsCopy = [...items];
    console.log("copy of items", itemsCopy);
    // if (Array.isArray(item)) {
    //   console.log("is item ever an array? ");
    //   item.forEach((it) => {
    //     itemsCopy.unshift(it);
    //   });
    //   setItemsCallback([...itemsCopy]);
    // } else {
    // itemsCopy.unshift(item);
    // setItemsCallback([...itemsCopy]);
    // }
  };

  const changeFocus = useCallback((focusIndex: number) => {
    setFocus(focusIndex);
  }, []);

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

  return (
    <Container>
      <Form addItem={addItem} changeFocus={changeFocus} />
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
              changeFocus={changeFocus}
              focus={focus}
            />
          );
        })}
      </Reorder.Group>
      <TodoCompletedList
        items={items}
        setItemsCallback={setItemsCallback}
        completedItems={completedItems}
      />
    </Container>
  );
}

export default TodoApp;

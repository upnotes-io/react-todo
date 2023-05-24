import React, { useCallback, useState } from "react";
import { Reorder } from "framer-motion";
import { Container } from "@material-ui/core";

import { Item, TodoCompletedList } from "./common";
import { Form } from "./common/Todo/Form";
import { TodoItem } from "./common/types";

import uuid from "react-uuid";

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

  const changeFocus = useCallback((focusIndex: number) => {
    setFocus(focusIndex);
  }, []);

  const addItem = (
    item: TodoItem | TodoItem[],
    cursorLocation?: number | null | undefined,
    itemIndex?: number
  ) => {
    const itemsCopy = [...items];
    //if we're typing in the "Add Item" input...
    if (
      typeof cursorLocation != "number" ||
      Array.isArray(item) ||
      itemIndex === undefined
    ) {
      if (Array.isArray(item)) {
        item.forEach((it) => {
          itemsCopy.unshift(it);
        });
        setItemsCallback([...itemsCopy]);
      } else {
        itemsCopy.unshift(item);
        setItemsCallback([...itemsCopy]);
      }
      return;
    }
    // else if we are typing in any other input
    let charsAfterCursor = "";
    for (let i = cursorLocation; i < item.name.length; i++) {
      charsAfterCursor += item.name[i];
    }
    let charsBeforeCursor = "";
    for (let i = 0; i < cursorLocation; i++) {
      charsBeforeCursor += item.name[i];
    }
    // do nothing if the field we are trying to Enter is blank
    if (!charsBeforeCursor && !charsAfterCursor) return;
    // split up names based on where cursor is when user clicks Enter
    const beforeItem = {
      name: charsBeforeCursor,
      uuid: uuid(),
      isComplete: false,
    };
    const afterItem = {
      name: charsAfterCursor,
      uuid: uuid(),
      isComplete: false,
    };
    // insert both halves of the input into the itemsCopy array
    itemsCopy.splice(itemIndex, 1, beforeItem, afterItem);
    // set items with updated array
    setItemsCallback([...itemsCopy]);
    // after enter is hit, re-position the cursor depending on where in the input it is
    if (!charsBeforeCursor) {
      changeFocus(itemsCopy.indexOf(beforeItem));
    } else {
      setTimeout(() => {
        const inputs = document.querySelectorAll("input[type='text']");
        const inputsArray = Array.from(inputs);
        const nextInputElement = inputsArray[
          itemsCopy.indexOf(afterItem) + 1
        ] as HTMLInputElement;
        changeFocus(itemsCopy.indexOf(afterItem));
        requestAnimationFrame(() => {
          nextInputElement.setSelectionRange(0, 0);
        });
      }, 0);
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

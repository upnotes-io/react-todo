import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import { Container } from "@material-ui/core";

import { Item, TodoCompletedList } from "./common";
import { Form } from "./common/Todo/Form";
import { TodoItem } from "./common/types";

export interface TodoAppProps {
  defaultItems?: TodoItem[];
  onChange: (items: TodoItem[]) => void;
}

type ActionItem = {
  data: TodoItem[] | TodoItem;
  action: 'added' | 'deleted';
}

function TodoApp(props: TodoAppProps) {
  const { defaultItems = [], onChange } = props;
  const [items, setItems] = useState<TodoItem[]>(defaultItems);
  const [focus, setFocus] = useState(-1);

  const [undoItems, setUndoItems] = useState<ActionItem[]>([]);
  const [redoItems, setRedoItems] = useState<ActionItem[]>([]);

  const setItemsCallback = useCallback((updatedItems: TodoItem[]) => {
    setItems(updatedItems);
    onChange(updatedItems);
  }, [onChange]);

  const onUndoItem = useCallback(() => {
		const lastActionItem = undoItems.at(-1);
		if (!lastActionItem) return;

    const updatedActionItems = [...undoItems];

    const updatedActionItem = updatedActionItems.pop();
    setUndoItems(updatedActionItems);

    if (updatedActionItem) {
      setRedoItems((prevItems) => [...prevItems, updatedActionItem]);
    }

    const data = lastActionItem.data;

		switch (lastActionItem.action) {
			case 'added': {
				const addedItems = items.filter((item) => {
					if (!Array.isArray(data)) return data.uuid !== item.uuid;

					const uuids = data.map((_item) => _item.uuid);
					return !uuids.includes(item.uuid);
				});

				setItemsCallback(addedItems);
        break;
			}
      case 'deleted': {
        const deletedItems: TodoItem[] = (Array.isArray(data) ? data : [data]).concat(items);
        setItemsCallback(deletedItems);

        break;
      }
		}
	}, [undoItems, items, setItemsCallback]);

	const onRedoItem = useCallback(() => {
		const lastActionItem = redoItems.at(-1);
		if (!lastActionItem) return;

    const updatedActionItems = [...redoItems];

    const updatedActionItem = updatedActionItems.pop();
    setRedoItems(updatedActionItems);

    if (updatedActionItem) {
			setUndoItems((prevItems) => [...prevItems, updatedActionItem]);
		}

    const data = lastActionItem.data;

		switch (lastActionItem.action) {
			case 'added': {
				const addedItems = (!Array.isArray(data) ? [data] : data).concat(items);
				setItemsCallback(addedItems);

        break;
			}
      case 'deleted': {
        const deletedItems = (!Array.isArray(data) ? [data] : data);
        const newItems = [...items];
				
        const uuids = deletedItems.map((item) => item.uuid);

        const ind = newItems.findIndex((item) => uuids.includes(item.uuid));
        if (ind === -1) return;
        
        newItems.splice(ind, 1);
        setItemsCallback(newItems);
        
        break;
      }
		}
	}, [redoItems, items, setItemsCallback]);

  useEffect(() => {
    const onUndoPressed = ({ repeat, ctrlKey, key }: KeyboardEvent) => {
      if (repeat || !ctrlKey) return;

      switch (key.toLowerCase()) {
        case 'z':
          onUndoItem();
          break;
        case 'y':
          onRedoItem()
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', onUndoPressed);
    return () => {
      window.removeEventListener('keydown', onUndoPressed);
    };
  }, [onUndoItem, onRedoItem]);

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
    setUndoItems((prevItems) => [...prevItems, { data: item, action: 'added' }]);
  };

  const changeFocus = useCallback((focusIndex: number) => {
    setFocus(focusIndex);
  },[])

  const completedItems = useMemo(() => items.filter((item) => item.isComplete), [items]);
  const todoItems = useMemo(() => items.filter((item) => !item.isComplete), [items]);

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

  const onRemoveItem = useCallback((uuid: string) => {
    const newItems = [...items];
    const ind = newItems.findIndex((item) => item.uuid === uuid);
    if (ind === -1) return;

    const removedItem = newItems.splice(ind, 1);
    setItemsCallback(newItems);

    const payload: ActionItem = { action: 'deleted', data: removedItem };

		setUndoItems((prevItems) => [...prevItems, payload]);
  }, [items, setItemsCallback]);

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
              onRemoveItem={onRemoveItem}
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

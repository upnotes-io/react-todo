import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import { Container } from "@material-ui/core";

import { Item, TodoCompletedList } from "./common";
import { Form } from "./common/Todo/Form";
import { TodoItem } from "./common/types";
import { ActionBar } from "./common/ActionBar";

export interface TodoAppProps {
  defaultItems?: TodoItem[];
  onChange: (items: TodoItem[]) => void;
}

type ActionItem = {
  data: TodoItem[] | TodoItem;
  action: 'added' | 'deleted' | 'updated';
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
		const lastActionItem = undoItems[undoItems.length -1 ];
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
      case 'updated': {
        const updatedItems: TodoItem[] = Array.isArray(data) ? data : [data];
        const prevItems = [...items];
        
        for (const updatedItem of updatedItems) {
          const ind = prevItems.findIndex((_item) => _item.uuid === updatedItem.uuid);
          if (ind === -1) continue;

          prevItems[ind].isComplete = !updatedItem.isComplete;
        }

        setItemsCallback(prevItems);

        break;
      }
		}
	}, [undoItems, items, setItemsCallback]);

	const onRedoItem = useCallback(() => {
		const lastActionItem = redoItems[redoItems.length - 1];
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
        const deletedItems = !Array.isArray(data) ? [data] : data;
        const newItems = [...items];
				
        const uuids = deletedItems.map((item) => item.uuid);

        const ind = newItems.findIndex((item) => uuids.includes(item.uuid));
        if (ind === -1) return;
        
        newItems.splice(ind, 1);
        setItemsCallback(newItems);
        
        break;
      }
      case 'updated': {
        const updatedItems: TodoItem[] = Array.isArray(data) ? data : [data];
        const prevItems = [...items];
        
        for (const updatedItem of updatedItems) {
          const ind = prevItems.findIndex((_item) => _item.uuid === updatedItem.uuid);
          if (ind === -1) continue;

          prevItems[ind].isComplete = !updatedItem.isComplete;
        }

        setItemsCallback(prevItems);

        break;
      }
		}
	}, [redoItems, items, setItemsCallback]);

  const onUndoOrRedo = useCallback(
		(e: KeyboardEvent) => {
			if (e.repeat) return; // it will suppress calling the event again n again when key is repeated

			const isMacbook = navigator.userAgent.toLowerCase().includes('mac');
			if (isMacbook && !e.metaKey) return; // whether a command key, on macbook, is pressed or not
			else if (!isMacbook && !e.ctrlKey) return; // whether a ctrl key, other than macbook, is pressed or not

			switch (e.key.toLowerCase()) {
				case 'z': {
          e.preventDefault();

					onUndoItem();
					break;
				}
				case 'y': {
          e.preventDefault();

					onRedoItem();
					break;
				}
				default:
					return;
			}
		},
		[onRedoItem, onUndoItem]
	);

  useEffect(() => {
		window.addEventListener('keydown', onUndoOrRedo, false);
		return () => {
			window.removeEventListener('keydown', onUndoOrRedo);
		};
	}, [onUndoOrRedo]);

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

  const canUndo = useMemo(() => !undoItems.length, [undoItems]);
  const canRedo = useMemo(() => !redoItems.length, [redoItems]);

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

  const onUpdateItem = useCallback((uuid: string, isComplete: boolean) => {
    const newItems = [...items];
    const ind = newItems.findIndex((item) => item.uuid === uuid);
    if (ind === -1) return;

    newItems[ind].isComplete = isComplete;
    setItemsCallback(newItems);

    const payload: ActionItem = { action: 'updated', data: newItems[ind] };
		setUndoItems((prevItems) => [...prevItems, payload]);
  }, [items, setItemsCallback]);

  return (
		<>
			<ActionBar onUndo={onUndoItem} onRedo={onRedoItem} canUndo={canUndo} canRedo={canRedo} />
			<Container>
				<Form addItem={addItem} changeFocus={changeFocus} />
				<Reorder.Group
					axis='y'
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
								onUpdateItem={onUpdateItem}
							/>
						);
					})}
				</Reorder.Group>
				<TodoCompletedList
					items={items}
					completedItems={completedItems}
					onUpdateItem={onUpdateItem}
				/>
			</Container>
		</>
	);
}

export default TodoApp;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Reorder } from 'framer-motion';
import { Container } from '@material-ui/core';

import { Item, TodoCompletedList } from './common';
import { Form } from './common/Todo/Form';
import { TodoItem } from './common/types';
import { ActionBar } from './common/ActionBar';

import uuid from 'react-uuid';

export interface TodoAppProps {
  defaultItems?: TodoItem[];
  onChange: (items: TodoItem[]) => void;
}

type ActionItem = {
  data: TodoItem[] | TodoItem;
  action: 'added' | 'deleted' | 'updated';
};

function TodoApp(props: TodoAppProps) {
  const { defaultItems = [], onChange } = props;
  const [items, setItems] = useState<TodoItem[]>(defaultItems);
  const [focus, setFocus] = useState(-1);

  const [undoItems, setUndoItems] = useState<ActionItem[]>([]);
  const [redoItems, setRedoItems] = useState<ActionItem[]>([]);

  const setItemsCallback = useCallback(
    (updatedItems: TodoItem[]) => {
      setItems(updatedItems);
      onChange(updatedItems);
    },
    [onChange]
  );

  const onUndoItem = useCallback(() => {
    if (!undoItems.length) return;

    const actionItems = [...undoItems];

    const actionItem = actionItems.pop();
    if (!actionItem) return;

    const { action, data } = actionItem;

    switch (action) {
      case 'added': {
        const addedItems = items.filter(item => {
          if (!Array.isArray(data)) return data.uuid !== item.uuid;

          const uuids = data.map(_item => _item.uuid);
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
          const ind = prevItems.findIndex(_item => _item.uuid === updatedItem.uuid);
          if (ind < 0) continue;

          actionItem.data = { ...actionItem.data, ...prevItems[ind] };
          prevItems[ind] = { ...prevItems[ind], ...updatedItem };
        }

        setItemsCallback(prevItems);
        break;
      }
    }

    setUndoItems(actionItems);
    setRedoItems(prev => [...prev, actionItem]);
  }, [undoItems, items, setItemsCallback]);

  const onRedoItem = useCallback(() => {
    if (!redoItems.length) return;

    const actionItems = [...redoItems];

    const actionItem = actionItems.pop();
    if (!actionItem) return;

    const { action, data } = actionItem;

    switch (action) {
      case 'added': {
        const addedItems = (!Array.isArray(data) ? [data] : data).concat(items);
        setItemsCallback(addedItems);

        break;
      }
      case 'deleted': {
        const deletedItems = !Array.isArray(data) ? [data] : data;
        const newItems = [...items];

        const uuids = deletedItems.map(item => item.uuid);

        const ind = newItems.findIndex(item => uuids.includes(item.uuid));
        if (ind !== -1) {
          newItems.splice(ind, 1);
          setItemsCallback(newItems);
        }

        break;
      }
      case 'updated': {
        const updatedItems: TodoItem[] = Array.isArray(data) ? data : [data];
        const prevItems = [...items];

        for (const updatedItem of updatedItems) {
          const ind = prevItems.findIndex(_item => _item.uuid === updatedItem.uuid);
          if (ind < 0) continue;

          actionItem.data = { ...actionItem.data, ...prevItems[ind] };
          prevItems[ind] = { ...prevItems[ind], ...updatedItem };
        }

        setItemsCallback(prevItems);
        break;
      }
    }

    setRedoItems(actionItems);
    setUndoItems(prev => [...prev, actionItem]);
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
    window.addEventListener('keydown', onUndoOrRedo);
    return () => {
      window.removeEventListener('keydown', onUndoOrRedo);
    };
  }, [onUndoOrRedo]);

  const changeFocus = useCallback((focusIndex: number) => {
    setFocus(focusIndex);
  }, []);

  const addItem = (item: TodoItem | TodoItem[], cursorLocation?: number | null | undefined, itemIndex?: number) => {
    const itemsCopy = [...items];
    //if we're typing in the "Add Item" input...
    if (typeof cursorLocation != 'number' || Array.isArray(item) || itemIndex === undefined) {
      if (Array.isArray(item)) {
        item.forEach(it => {
          itemsCopy.unshift(it);
        });
        setItemsCallback([...itemsCopy]);
      } else {
        itemsCopy.unshift(item);
        setItemsCallback([...itemsCopy]);
      }
      setUndoItems(prevItems => [...prevItems, { data: item, action: 'added' }]);
      return;
    }
    // else if we are typing in any other input
    let charsAfterCursor = '';
    for (let i = cursorLocation; i < item.name.length; i++) {
      charsAfterCursor += item.name[i];
    }
    let charsBeforeCursor = '';
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

    setUndoItems(prevItems => [...prevItems, { data: [beforeItem, afterItem], action: 'added' }]);

    // set items with updated array
    setItemsCallback([...itemsCopy]);
    // after enter is hit, re-position the cursor depending on where in the input it is
    if (!charsBeforeCursor) {
      changeFocus(itemsCopy.indexOf(beforeItem));
    } else {
      setTimeout(() => {
        const inputs = document.querySelectorAll("input[type='text']");
        const inputsArray = Array.from(inputs);
        const nextInputElement = inputsArray[itemsCopy.indexOf(afterItem) + 1] as HTMLInputElement;
        changeFocus(itemsCopy.indexOf(afterItem));
        requestAnimationFrame(() => {
          nextInputElement.setSelectionRange(0, 0);
        });
      }, 0);
    }
  };

  const completedItems = useMemo(() => items.filter(item => item.isComplete), [items]);
  const todoItems = useMemo(() => items.filter(item => !item.isComplete), [items]);

  const canUndo = useMemo(() => !undoItems.length, [undoItems]);
  const canRedo = useMemo(() => !redoItems.length, [redoItems]);

  const handleReorderTodoItems = (newOrder: string[]) => {
    const updatedItems = newOrder.reduce((currItems: TodoItem[] = [], itemKey) => {
      const item = todoItems.find(item => item.uuid === itemKey);
      if (item) {
        currItems.push(item);
      }
      return currItems;
    }, []);
    setItems([...updatedItems, ...completedItems]);
  };

  const onRemoveItem = useCallback(
    (uuid: string) => {
      const newItems = [...items];
      const ind = newItems.findIndex(item => item.uuid === uuid);
      if (ind < 0) return;

      const [removedItem] = newItems.splice(ind, 1);
      setItemsCallback(newItems);

      const payload: ActionItem = { action: 'deleted', data: removedItem };

      setUndoItems(prev => [...prev, payload]);
    },
    [items, setItemsCallback]
  );

  // Same as onRemove but will merge the deleting note with the previous note
  const onMergeItem = useCallback(
    (uuid: string) => {
      const newItems = [...items];
      const ind = newItems.findIndex(item => item.uuid === uuid);
      if (ind < 0) return;
      const [removedItem] = newItems.splice(ind, 1);
      if (ind > 0) items[ind - 1].name += ' ' + items[ind].name;
      setItemsCallback(newItems);
      const payload: ActionItem = { action: 'deleted', data: removedItem };
      setUndoItems(prev => [...prev, payload]);
    },
    [items, setItemsCallback]
  );

  const onUpdateItem = useCallback(
    ({ uuid, ...item }: TodoItem) => {
      const prevItems = [...items];

      const ind = prevItems.findIndex(item => item.uuid === uuid);
      if (ind < 0) return;

      const data = { ...prevItems[ind] };
      prevItems[ind] = { ...data, ...item };

      const payload: ActionItem = { action: 'updated', data };
      setUndoItems(prev => [...prev, payload]);

      setItemsCallback(prevItems);
    },
    [items, setItemsCallback]
  );
  return (
    <Container>
      <ActionBar onUndo={onUndoItem} onRedo={onRedoItem} canUndo={canUndo} canRedo={canRedo} />
      <Form addItem={addItem} changeFocus={changeFocus} />
      <Reorder.Group axis="y" values={items.map(item => item.uuid)} onReorder={handleReorderTodoItems}>
        {items.map((item, index) => {
          return (
            <Item
              key={item.uuid}
              items={items}
              addItem={addItem}
              itemIndex={index}
              changeFocus={changeFocus}
              focus={focus}
              onRemoveItem={onRemoveItem}
              onUpdateItem={onUpdateItem}
              onMergeItem={onMergeItem}
            />
          );
        })}
      </Reorder.Group>
      <TodoCompletedList items={items} completedItems={completedItems} onUpdateItem={onUpdateItem} />
    </Container>
  );
}

export default TodoApp;

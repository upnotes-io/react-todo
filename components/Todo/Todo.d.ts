/// <reference types="react" />
export interface TodoItem {
    name: string;
    isComplete: boolean;
    uuid: string;
}
export interface AddProps {
    addItem: (item: TodoItem | TodoItem[]) => void;
}
export interface TodoCompletedItemsProp {
    items: TodoItem[];
    setItemsCallback: (updatedItems: TodoItem[]) => void;
    itemIndex: number;
}
export interface TodoAppProps {
    defaultItems?: TodoItem[];
    onChange: (items: TodoItem[]) => void;
}
declare const _default: (props: TodoAppProps) => JSX.Element;
export default _default;

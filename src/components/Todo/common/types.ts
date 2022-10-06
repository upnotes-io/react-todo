export interface TodoItem {
    name: string;
    isComplete: boolean;
    uuid: string;
}

export interface PushMeta {
    position: string;
    index: number;
}
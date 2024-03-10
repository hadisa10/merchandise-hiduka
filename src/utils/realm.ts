import * as Realm from "realm-web";

export const toggleBoolean = (prev: boolean): boolean => !prev;

const isValidArrayIndex = (arr: any[], idx: number): boolean => !(idx < 0 || idx >= arr.length);

export function addValueAtIndex<T>(arr: T[], idx: number, value: T): T[] {
    if (!isValidArrayIndex(arr, idx) && idx !== arr.length) {
        throw new Error(`Cannot add value. Array index out of bounds.`);
    }
    return [...arr.slice(0, idx), value, ...arr.slice(idx)];
}

export function replaceValueAtIndex<T>(arr: T[], idx: number, newValue: T): T[] {
    if (!isValidArrayIndex(arr, idx)) {
        throw new Error(`Cannot replace value. Array index out of bounds.`);
    }
    return [...arr.slice(0, idx), newValue, ...arr.slice(idx + 1)];
}

export function updateValueAtIndex<T>(arr: T[], idx: number, updater: (value: T) => T): T[] {
    if (!isValidArrayIndex(arr, idx)) {
        throw new Error(`Cannot update value. Array index out of bounds.`);
    }
    return [...arr.slice(0, idx), updater(arr[idx]), ...arr.slice(idx + 1)];
}

export function removeValueAtIndex<T>(arr: T[], idx: number): T[] {
    if (!isValidArrayIndex(arr, idx)) {
        throw new Error(`Cannot remove value. Array index out of bounds.`);
    }
    return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export const createObjectId = (): Realm.BSON.ObjectId => new Realm.BSON.ObjectId();
export const convertObjectId = (_id: string): Realm.BSON.ObjectId => {
    const idStr = _id.toString();
    const d = new Realm.BSON.ObjectId(idStr);
    return d
};

export const getTodoId = (todo: { _id: Realm.BSON.ObjectId | string }): string => {
    if (todo._id instanceof Realm.BSON.ObjectId) {
        return todo._id.toHexString();
    }
    return todo._id as string;
};

export const isSameTodo = (todo1: { _id: Realm.BSON.ObjectId | string }, todo2: { _id: Realm.BSON.ObjectId | string }): boolean =>
    getTodoId(todo1) === getTodoId(todo2);

export const getTodoIndex = (todos: { _id: Realm.BSON.ObjectId | string }[], todo: { _id: Realm.BSON.ObjectId | string }): number | null => {
    const idx = todos.findIndex((t) => isSameTodo(t, todo));
    return idx >= 0 ? idx : null;
};

export const getClientIndex = (clients: { _id: Realm.BSON.ObjectId | string }[], client: { _id: Realm.BSON.ObjectId | string }): number | null => {
    const idx = clients?.findIndex((t) => isSameTodo(t, client));
    return idx >= 0 ? idx : null;
};
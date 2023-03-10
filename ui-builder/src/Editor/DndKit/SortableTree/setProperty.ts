import { UniqueIdentifier } from "@dnd-kit/core";
import { TreeItem, TreeItems } from "./TreeItems";

export function setProperty<T extends keyof TreeItem>(
    items: TreeItems,
    id: UniqueIdentifier,
    property: T,
    setter: (value: TreeItem[T]) => TreeItem[T],
) {
    for (const item of items) {
        if (item.id === id) {
            item[property] = setter(item[property]);
            continue;
        }

        if (item.children.length) {
            item.children = setProperty(item.children, id, property, setter);
        }
    }

    return [...items];
}

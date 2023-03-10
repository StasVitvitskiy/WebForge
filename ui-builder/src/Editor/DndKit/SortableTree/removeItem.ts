import { TreeItems } from "./TreeItems";
import { UniqueIdentifier } from "@dnd-kit/core";

export function removeItem(items: TreeItems, id: UniqueIdentifier) {
    const newItems = [];

    for (const item of items) {
        if (item.id === id) {
            continue;
        }

        if (item.children.length) {
            item.children = removeItem(item.children, id);
        }

        newItems.push(item);
    }

    return newItems;
}

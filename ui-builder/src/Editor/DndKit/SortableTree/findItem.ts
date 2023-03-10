import { TreeItem } from "./TreeItems";
import { UniqueIdentifier } from "@dnd-kit/core";

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
    return items.find(({ id }) => id === itemId);
}

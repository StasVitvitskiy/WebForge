import { type TreeItem, type TreeItems } from "./TreeItems";
import { type UniqueIdentifier } from "@dnd-kit/core";

export function findItemDeep(
    items: TreeItems,
    itemId: UniqueIdentifier,
): TreeItem | undefined {
    for (const item of items) {
        const { id, children } = item;

        if (id === itemId) {
            return item;
        }

        if (children.length > 0) {
            const child = findItemDeep(children, itemId);

            if (child != null) {
                return child;
            }
        }
    }

    return undefined;
}

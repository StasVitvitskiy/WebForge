import { FlattenedItem } from "./TreeItems";

export function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
    if (previousItem) {
        return previousItem.depth + 1;
    }

    return 0;
}

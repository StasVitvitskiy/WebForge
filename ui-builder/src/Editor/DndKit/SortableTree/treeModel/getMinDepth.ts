import { FlattenedItem } from "./TreeItems";

export function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
    if (nextItem) {
        return nextItem.depth;
    }

    return 0;
}

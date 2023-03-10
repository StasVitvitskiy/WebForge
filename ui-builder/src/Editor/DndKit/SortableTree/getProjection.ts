import { FlattenedItem } from "~/Editor/DndKit/SortableTree/TreeItems";
import { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { getDragDepth } from "./getDragDepth";
import { getMaxDepth } from "./getMaxDepth";
import { getMinDepth } from "~/Editor/DndKit/SortableTree/getMinDepth";

export function getProjection(
    items: FlattenedItem[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    dragOffset: number,
    indentationWidth: number,
) {
    const overItemIndex = items.findIndex(({ id }) => id === overId);
    const activeItemIndex = items.findIndex(({ id }) => id === activeId);
    const activeItem = items[activeItemIndex] as FlattenedItem;
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1] as FlattenedItem;
    const nextItem = newItems[overItemIndex + 1] as FlattenedItem;
    const dragDepth = getDragDepth(dragOffset, indentationWidth);
    const projectedDepth = activeItem.depth + dragDepth;
    const maxDepth = getMaxDepth({
        previousItem,
    });
    const minDepth = getMinDepth({ nextItem });
    let depth = projectedDepth;

    if (projectedDepth >= maxDepth) {
        depth = maxDepth;
    } else if (projectedDepth < minDepth) {
        depth = minDepth;
    }

    return { depth, maxDepth, minDepth, parentId: getParentId() };

    function getParentId() {
        if (depth === 0 || !previousItem) {
            return null;
        }

        if (depth === previousItem.depth) {
            return previousItem.parentId;
        }

        if (depth > previousItem.depth) {
            return previousItem.id;
        }

        const newParent = newItems
            .slice(0, overItemIndex)
            .reverse()
            .find((item) => item.depth === depth)?.parentId;

        return newParent ?? null;
    }
}

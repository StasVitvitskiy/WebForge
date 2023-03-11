import { UniqueIdentifier } from "@dnd-kit/core";
import { FlattenedItem } from "./TreeItems";

export function removeChildrenOf(
    items: FlattenedItem[],
    ids: UniqueIdentifier[],
) {
    const excludeParentIds = [...ids];

    return items.filter((item) => {
        if (item.parentId && excludeParentIds.includes(item.parentId)) {
            if (item.children.length) {
                excludeParentIds.push(item.id);
            }
            return false;
        }

        return true;
    });
}

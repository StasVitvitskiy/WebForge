import { TreeItems } from "./TreeItems";
import { UniqueIdentifier } from "@dnd-kit/core";
import { findItemDeep } from "./findItemDeep";
import { countChildren } from "./countChildren";

export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
    const item = findItemDeep(items, id);

    return item ? countChildren(item.children) : 0;
}

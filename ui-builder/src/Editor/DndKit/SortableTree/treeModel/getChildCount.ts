import { type TreeItems } from "./TreeItems";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { findItemDeep } from "./findItemDeep";
import { countChildren } from "./countChildren";

export function getChildCount(items: TreeItems, id: UniqueIdentifier): number {
    const item = findItemDeep(items, id);

    return item != null ? countChildren(item.children) : 0;
}

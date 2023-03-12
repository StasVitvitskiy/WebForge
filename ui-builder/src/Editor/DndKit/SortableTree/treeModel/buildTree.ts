import { findItem } from "./findItem";
import { type FlattenedItem, type TreeItem, type TreeItems } from "./TreeItems";

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
    const root: TreeItem = { id: "root", children: [], name: "root" };
    const nodes: Record<string, TreeItem> = { [root.id]: root };
    const items = flattenedItems.map((item) => ({ ...item, children: [] }));

    for (const item of items) {
        const { id, children, name } = item;
        const parentId = item.parentId ?? root.id;
        const parent = nodes[parentId] ?? findItem(items, parentId);

        nodes[id] = { id, children, name };
        parent!.children.push(item);
    }

    return root.children;
}

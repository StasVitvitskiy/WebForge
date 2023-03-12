import { type TreeItem } from "./TreeItems";

export function countChildren(items: TreeItem[], count = 0): number {
    return items.reduce((acc, { children }) => {
        if (children.length > 0) {
            return countChildren(children, acc + 1);
        }

        return acc + 1;
    }, count);
}

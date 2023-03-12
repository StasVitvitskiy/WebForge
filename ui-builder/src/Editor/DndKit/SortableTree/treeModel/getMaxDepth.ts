import { type FlattenedItem } from "./TreeItems"

export function getMaxDepth({
  previousItem,
}: {
  previousItem: FlattenedItem
}): number {
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

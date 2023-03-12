import { type FlattenedItem } from "./TreeItems"

export function getMinDepth({ nextItem }: { nextItem: FlattenedItem }): number {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

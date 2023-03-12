import { type TreeItem } from "./TreeItems"
import { type UniqueIdentifier } from "@dnd-kit/core"

export function findItem(
  items: TreeItem[],
  itemId: UniqueIdentifier,
): TreeItem | undefined {
  return items.find(({ id }) => id === itemId)
}

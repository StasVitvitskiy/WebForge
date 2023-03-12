import { type TreeItems } from "./TreeItems"
import { type UniqueIdentifier } from "@dnd-kit/core"

export function removeItem(items: TreeItems, id: UniqueIdentifier): TreeItems {
  const newItems = []

  for (const item of items) {
    if (item.id === id) {
      continue
    }

    if (item.children.length > 0) {
      item.children = removeItem(item.children, id)
    }

    newItems.push(item)
  }

  return newItems
}

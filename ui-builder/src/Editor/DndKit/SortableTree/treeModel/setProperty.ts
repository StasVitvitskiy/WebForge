import { type UniqueIdentifier } from "@dnd-kit/core"
import { type TreeItem, type TreeItems } from "./TreeItems"

export function setProperty<T extends keyof TreeItem>(
  items: TreeItems,
  id: UniqueIdentifier,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T],
): TreeItems {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property])
      continue
    }

    if (item.children.length > 0) {
      item.children = setProperty(item.children, id, property, setter)
    }
  }

  return [...items]
}

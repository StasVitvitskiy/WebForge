import { type UniqueIdentifier } from "@dnd-kit/core"
import { type FlattenedItem } from "./TreeItems"

export function removeChildrenOf(
  items: FlattenedItem[],
  ids: UniqueIdentifier[],
): FlattenedItem[] {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (
      Boolean(item.parentId) &&
            excludeParentIds.includes(item.parentId as UniqueIdentifier)
    ) {
      if (item.children.length > 0) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}

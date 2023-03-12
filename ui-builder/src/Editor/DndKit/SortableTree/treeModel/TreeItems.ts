import type { UniqueIdentifier } from "@dnd-kit/core"

export interface TreeItem {
  id: UniqueIdentifier
  name: string
  children: TreeItem[]
  collapsed?: boolean
}

export type TreeItems = TreeItem[]

export type DndKitSortableTreeItem = TreeItem
export type DndKitSortableTreeItems = TreeItems

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null
  depth: number
  index: number
}

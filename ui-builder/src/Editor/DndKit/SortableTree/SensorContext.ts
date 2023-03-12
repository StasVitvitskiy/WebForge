import { type FlattenedItem } from "~/Editor/DndKit/SortableTree/treeModel/TreeItems"
import type { MutableRefObject } from "react"

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>

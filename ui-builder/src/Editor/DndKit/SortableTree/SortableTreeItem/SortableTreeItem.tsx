import React, { type CSSProperties } from "react"
import type { UniqueIdentifier } from "@dnd-kit/core"
import { type AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { TreeItem, type TreeItemProps } from "./TreeItem"
import { isIOS } from "~/Editor/DndKit/SortableTree/platform/isIOS"

interface SortableTreeItemProps extends TreeItemProps {
  id: UniqueIdentifier
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => !(isSorting || wasDragging)

export function SortableTreeItem({
  id,
  depth,
  ...props
}: SortableTreeItemProps): JSX.Element {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  })
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
        <TreeItem
            ref={setDraggableNodeRef}
            wrapperRef={setDroppableNodeRef}
            style={style}
            depth={depth}
            ghost={isDragging}
            disableSelection={isIOS}
            disableInteraction={isSorting}
            handleProps={{
              ...attributes,
              ...listeners,
            }}
            {...props}
        />
  )
}

import { words } from "lodash"
import React from "react"
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock"

export function DraggableBlockFigure({
  block,
}: {
  block: EditorBuildingBlock
}): JSX.Element {
  const { Icon = () => null } = block

  return (
        <figure className="flex cursor-pointer flex-col content-center items-center">
            <Icon />
            <figcaption className="py-2">
                {words(block.name).join(" ")}
            </figcaption>
        </figure>
  )
}

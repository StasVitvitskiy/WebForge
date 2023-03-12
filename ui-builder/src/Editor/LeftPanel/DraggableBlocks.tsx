import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock"
import React, { useMemo } from "react"
import { groupBy } from "lodash"
import { EditorBuildingBlockGroup } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlockGroup"
import { Accordion } from "flowbite-react"
import { styled } from "@linaria/react"
import { Draggable } from "~/Editor/LeftPanel/Draggable"
import { DraggableBlockFigure } from "~/Editor/LeftPanel/DraggableBlockFigure"

const Wrapper = styled.div`
    button[type="button"] {
        padding: 10px;
    }
`

export function DraggableBlocks({
  buildingBlocks,
}: {
  buildingBlocks: Record<string, EditorBuildingBlock>
}): JSX.Element {
  const groups = useMemo(
    () =>
      groupBy(
        Object.values(buildingBlocks)
          .filter((block) => block.Icon)
          .map((block) => ({
            ...block,
            group: block.group ?? EditorBuildingBlockGroup.Other,
          })),
        "group",
      ),
    [buildingBlocks],
  )
  const groupNames = useMemo(() => Object.keys(groups), [groups])

  return (
        <Wrapper>
            <Accordion>
                {groupNames.map((groupName) => (
                    <Accordion.Panel key={groupName}>
                        <Accordion.Title className="bg-gray-800 text-white hover:bg-gray-800 hover:text-white">
                            {groupName}
                        </Accordion.Title>
                        <Accordion.Content>
                            {groups[groupName]?.map((block) => {
                              return (
                                    <Draggable key={block.name} id={block.name}>
                                        <DraggableBlockFigure block={block} />
                                    </Draggable>
                              )
                            })}
                        </Accordion.Content>
                    </Accordion.Panel>
                ))}
            </Accordion>
        </Wrapper>
  )
}

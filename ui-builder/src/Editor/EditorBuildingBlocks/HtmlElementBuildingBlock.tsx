import { styled } from "@linaria/react"
import React from "react"
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock"
import { EditorBuildingBlockGroup } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlockGroup"
import { ImHtmlFive } from "react-icons/im"
import { Droppable } from "~/Editor/Canvas/Droppable"
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock"

const Renderer: EditorBuildingBlock["Renderer"] = ({ children, ...props }) => {
  const {
    attributes: { tagName, className, style },
  } = props

  const elementWithCustomTagName = React.createElement(tagName as string, {
    className,
    style,
    children,
  })

  return <Droppable {...props}>{elementWithCustomTagName}</Droppable>
}

const Icon = styled(ImHtmlFive)`
    width: 24px;
    height: 24px;
`

export const HtmlElementBuilderBlock: EditorBuildingBlock = {
  name: "HtmlElement",
  Renderer,
  group: EditorBuildingBlockGroup.Basics,
  Icon,
  createUiBlock: (id: string): UiModelBuildingBlock => ({
    id,
    type: HtmlElementBuilderBlock.name,
    attributes: {
      tagName: "div",
      style: {
        height: "200px",
      },
    },
  }),
}

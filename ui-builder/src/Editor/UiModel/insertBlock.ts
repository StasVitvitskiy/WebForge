import { type UiModel } from "~/Editor/UiModel/UiModel"
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock"
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock"
import { generateNewBlockId } from "~/Editor/UiModel/generateNewBlockId"

export function insertBlock({
  uiModel,
  parentId,
  newBlock,
}: {
  uiModel: UiModel
  parentId: string
  newBlock: EditorBuildingBlock
}): UiModel {
  const newBlockId = generateNewBlockId()
  return {
    ...uiModel,
    blocks: insertChildBlock({
      blocks: [uiModel],
      parentId,
      newBlock,
      newBlockId,
    })?.[0]?.blocks as UiModelBuildingBlock[],
    activeElement: newBlockId,
  }
}

function insertChildBlock({
  blocks,
  parentId,
  newBlock,
  newBlockId,
}: {
  blocks: UiModelBuildingBlock[]
  parentId: string
  newBlock: EditorBuildingBlock
  newBlockId: string
}): UiModelBuildingBlock[] {
  return blocks.map((block) => {
    if (block.id === parentId) {
      return {
        ...block,
        blocks: (block.blocks ?? []).concat(
          newBlock?.createUiBlock?.(newBlockId) ?? {
            type: newBlock.name,
            attributes: {},
            id: newBlockId,
          },
        ),
      }
    }

    return {
      ...block,
      blocks: insertChildBlock({
        blocks: block.blocks ?? [],
        parentId,
        newBlock,
        newBlockId,
      }),
    }
  })
}

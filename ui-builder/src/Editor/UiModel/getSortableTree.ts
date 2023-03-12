import { type UiModel } from "~/Editor/UiModel/UiModel"
import {
  type DndKitSortableTreeItem,
  type DndKitSortableTreeItems,
} from "~/Editor/DndKit/SortableTree/treeModel/TreeItems"
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock"

export function getSortableTree(uiModel: UiModel): DndKitSortableTreeItems {
  return uiModel.blocks.flatMap(convertUiModelBlock)
}

function convertUiModelBlock(
  block: UiModelBuildingBlock,
): DndKitSortableTreeItem[] {
  return [
    {
      id: block.id,
      name: block.name ?? block.type,
      children: (block.blocks ?? []).flatMap(convertUiModelBlock),
      collapsed: false,
    },
  ]
}

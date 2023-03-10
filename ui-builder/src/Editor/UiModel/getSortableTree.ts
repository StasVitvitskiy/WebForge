import { UiModel } from "~/Editor/UiModel/UiModel";
import {
    DndKitSortableTreeItem,
    DndKitSortableTreeItems,
} from "~/Editor/DndKit/SortableTree/TreeItems";
import { UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export function getSortableTree(uiModel: UiModel): DndKitSortableTreeItems {
    return uiModel.blocks.flatMap(convertUiModelBlock);
}

function convertUiModelBlock(
    block: UiModelBuildingBlock,
): DndKitSortableTreeItem[] {
    return [
        {
            id: block.id,
            name: block.name || block.type,
            children: (block.blocks || []).flatMap(convertUiModelBlock),
            collapsed: false,
        },
    ];
}

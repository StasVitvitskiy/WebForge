import { type UiModel } from "~/Editor/UiModel/UiModel";
import {
    type DndKitSortableTreeItems,
    type DndKitSortableTreeItem,
} from "~/Editor/DndKit/SortableTree/treeModel/TreeItems";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { flattenUiModelBlocks } from "./flattenUiModelBlocks";

export function updateModelOnSort({
    uiModel,
    sortableTree,
}: {
    uiModel: UiModel;
    sortableTree: DndKitSortableTreeItems;
}): UiModel {
    const uiModelBlocksHasMap = flattenUiModelBlocks(uiModel.blocks).reduce(
        (acc, next) => ({
            ...acc,
            [next.id]: next,
        }),
        {},
    );

    return {
        ...uiModel,
        blocks: updateModelBlocks({
            uiModelBlocksHasMap,
            sortableTree,
        }),
    };
}

function updateModelBlocks({
    uiModelBlocksHasMap,
    sortableTree,
}: {
    uiModelBlocksHasMap: Record<string, UiModelBuildingBlock>;
    sortableTree: DndKitSortableTreeItems;
}): UiModelBuildingBlock[] {
    return sortableTree.map((treeItem: DndKitSortableTreeItem) => {
        const block = uiModelBlocksHasMap[treeItem.id] as UiModelBuildingBlock;

        return {
            ...block,
            id: treeItem.id as string,
            blocks: updateModelBlocks({
                uiModelBlocksHasMap,
                sortableTree: treeItem.children,
            }),
        };
    });
}

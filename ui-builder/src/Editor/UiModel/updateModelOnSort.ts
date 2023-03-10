import { UiModel } from "~/Editor/UiModel/UiModel";
import { DndKitSortableTreeItems } from "~/Editor/DndKit/SortableTree/TreeItems";
import { UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

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

function flattenUiModelBlocks(
    blocks: UiModelBuildingBlock[],
): UiModelBuildingBlock[] {
    return blocks.flatMap((block) => [
        block,
        ...flattenUiModelBlocks(block.blocks || []),
    ]);
}

function updateModelBlocks({
    uiModelBlocksHasMap,
    sortableTree,
}: {
    uiModelBlocksHasMap: Record<string, UiModelBuildingBlock>;
    sortableTree: DndKitSortableTreeItems;
}): UiModelBuildingBlock[] {
    return sortableTree.map((treeItem) => {
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

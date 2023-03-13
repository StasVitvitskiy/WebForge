import { type UiModel } from "~/Editor/UiModel/UiModel";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export function updateModelBlock({
    uiModel,
    updatedBlock,
}: {
    uiModel: UiModel;
    updatedBlock: UiModelBuildingBlock;
}): UiModel {
    return {
        ...uiModel,
        blocks: updateUiBlock({
            blocks: uiModel.blocks,
            updatedBlock,
        }),
    };
}

function updateUiBlock({
    blocks,
    updatedBlock,
}: {
    blocks: UiModelBuildingBlock[];
    updatedBlock: UiModelBuildingBlock;
}): UiModelBuildingBlock[] {
    return blocks.map((block) => {
        if (block.id === updatedBlock.id) {
            return updatedBlock;
        }

        return {
            ...block,
            blocks: updateUiBlock({
                blocks: block.blocks ?? [],
                updatedBlock,
            }),
        };
    });
}

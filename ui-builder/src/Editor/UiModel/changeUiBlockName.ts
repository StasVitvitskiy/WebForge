import { UiModel } from "~/Editor/UiModel/UiModel";
import { UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export function changeUiBlockName({
    uiModel,
    id,
    name,
}: {
    uiModel: UiModel;
    id: string;
    name: string;
}): UiModel {
    return {
        ...uiModel,
        blocks: uiModel.blocks.map((block) =>
            changeBlockName({
                uiBlock: block,
                id,
                name,
            }),
        ),
    };
}

function changeBlockName({
    uiBlock,
    id,
    name,
}: {
    uiBlock: UiModelBuildingBlock;
    id: string;
    name: string;
}): UiModelBuildingBlock {
    if (uiBlock.id === id) {
        return {
            ...uiBlock,
            name,
        };
    }

    return {
        ...uiBlock,
        blocks: (uiBlock.blocks || []).map((childBlock) =>
            changeBlockName({
                uiBlock: childBlock,
                id,
                name,
            }),
        ),
    };
}

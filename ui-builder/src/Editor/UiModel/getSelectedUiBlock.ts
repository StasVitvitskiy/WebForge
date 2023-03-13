import { type UiModel } from "~/Editor/UiModel/UiModel";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { flattenUiModelBlocks } from "~/Editor/UiModel/flattenUiModelBlocks";

export function getSelectedUiBlock({
    uiModel,
}: {
    uiModel: UiModel;
}): UiModelBuildingBlock | undefined {
    return flattenUiModelBlocks(uiModel.blocks).find(
        (block) => block.id === uiModel.activeElement,
    );
}

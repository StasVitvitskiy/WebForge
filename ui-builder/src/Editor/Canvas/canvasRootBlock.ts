import { RootBuildingBlock } from "~/Editor/EditorBuildingBlocks/RootBuildingBlock";
import { generateNewBlockId } from "~/Editor/UiModel/generateNewBlockId";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export const canvasRootBlock: UiModelBuildingBlock = {
    id: generateNewBlockId(),
    type: RootBuildingBlock.name,
    attributes: {
        style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "white",
        },
    },
};

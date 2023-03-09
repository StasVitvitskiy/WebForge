import { UiModel } from "~/Editor/UiModel/UiModel";
import { v4 as uuidv4 } from "uuid";
import { RootBuildingBlock } from "~/Editor/EditorBuildingBlocks/RootBuildingBlock";

export const EmptyPageModel: UiModel = {
    type: "Page",
    attributes: {
        title: "",
        description: "",
    },
    blocks: [
        {
            id: uuidv4(),
            type: RootBuildingBlock.name,
            attributes: {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
            },
        },
    ],
};

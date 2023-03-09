import { UiModel } from "~/Editor/UiModel/UiModel";
import { EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { v4 as uuidv4 } from "uuid";

export function insertBlock({
    uiModel,
    parentId,
    newBlock,
}: {
    uiModel: UiModel;
    parentId: string;
    newBlock: EditorBuildingBlock;
}): UiModel {
    const newBlockId = uuidv4();
    return {
        ...uiModel,
        blocks: insertChildBlock({
            blocks: uiModel.blocks,
            parentId,
            newBlock,
            newBlockId,
        }),
        activeElement: newBlockId,
    };
}

function insertChildBlock({
    blocks,
    parentId,
    newBlock,
    newBlockId,
}: {
    blocks: UiModelBuildingBlock[];
    parentId: string;
    newBlock: EditorBuildingBlock;
    newBlockId: string;
}): UiModelBuildingBlock[] {
    return blocks.map((block) => {
        if (block.id === parentId) {
            return {
                ...block,
                blocks: (block.blocks || []).concat({
                    type: newBlock.name,
                    attributes: {},
                    id: newBlockId,
                }),
            };
        }

        return {
            ...block,
            blocks: insertChildBlock({
                blocks: block.blocks || [],
                parentId,
                newBlock,
                newBlockId,
            }),
        };
    });
}

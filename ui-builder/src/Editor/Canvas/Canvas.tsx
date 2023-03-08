import { UiModel } from "~/Editor/UiModel/UiModel";
import { EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import React from "react";
import { Droppable } from "~/Editor/Canvas/Droppable";

export function Canvas({
    uiModel,
    buildingBlocks,
}: {
    uiModel: UiModel;
    buildingBlocks: Record<string, EditorBuildingBlock>;
}) {
    return (
        <div>
            {uiModel.blocks.map((block) => {
                const Renderer = buildingBlocks?.[block.type]?.Renderer;

                if (!Renderer) {
                    throw new Error(
                        `can't render block ${JSON.stringify(block)}`,
                    );
                }

                return (
                    <Droppable {...block}>
                        <Renderer {...block} />
                    </Droppable>
                );
            })}
        </div>
    );
}

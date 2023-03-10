import { UiModel } from "~/Editor/UiModel/UiModel";
import { EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import React, { useCallback, useContext, useMemo } from "react";
import { UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { omit } from "lodash";
import { UiEditorContext } from "~/Editor/UiEditorContext";
import { setActiveElement } from "~/Editor/UiModel/setActiveElement";
import { canvasRootBlock } from "~/Editor/Canvas/canvasRootBlock";

export function Canvas({
    uiModel,
    buildingBlocks,
}: {
    uiModel: UiModel;
    buildingBlocks: Record<string, EditorBuildingBlock>;
}) {
    const rootUiBlock = useMemo(
        () => ({
            ...canvasRootBlock,
            id: uiModel.id,
            blocks: uiModel.blocks,
        }),
        [uiModel],
    );

    return (
        <BlockWithChildren
            key={rootUiBlock.id}
            uiBlock={rootUiBlock}
            buildingBlocks={buildingBlocks}
            activeElement={uiModel.activeElement}
        />
    );
}

function BlockWithChildren({
    uiBlock,
    buildingBlocks,
    activeElement,
}: {
    uiBlock: UiModelBuildingBlock;
    buildingBlocks: Record<string, EditorBuildingBlock>;
    activeElement?: string;
}) {
    const Renderer = buildingBlocks?.[uiBlock.type]?.Renderer;
    const editorCtx = useContext(UiEditorContext);

    if (!Renderer) {
        throw new Error(
            `can't render block ${JSON.stringify(omit(uiBlock, "blocks"))}`,
        );
    }

    const onActiveElementClick = useCallback(
        (event: React.SyntheticEvent) => {
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();

            editorCtx.onChange(
                setActiveElement({
                    uiModel: editorCtx.uiModel as UiModel,
                    activeElement: uiBlock.id,
                }),
            );
        },
        [uiBlock, editorCtx],
    );

    return (
        <div
            className={
                activeElement === uiBlock.id
                    ? `${uiBlock?.attributes?.className} border border-blue-600`
                    : undefined
            }
            style={uiBlock?.attributes?.style}
            onClick={onActiveElementClick}
        >
            <Renderer key={uiBlock.id} {...uiBlock}>
                {(uiBlock.blocks || []).map((childUiBlock) => (
                    <BlockWithChildren
                        key={childUiBlock.id}
                        uiBlock={childUiBlock}
                        buildingBlocks={buildingBlocks}
                        activeElement={activeElement}
                    />
                ))}
            </Renderer>
        </div>
    );
}

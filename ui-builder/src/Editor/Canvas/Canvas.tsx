import { type UiModel } from "~/Editor/UiModel/UiModel";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import React, { useCallback, useContext, useMemo } from "react";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { omit } from "lodash";
import { UiEditorContext } from "~/Editor/UiEditorContext";
import { setActiveElement } from "~/Editor/UiModel/setActiveElement";
import { canvasRootBlock } from "./canvasRootBlock";
import { RootBuildingBlock } from "./RootBuildingBlock";

export function Canvas({
    uiModel,
    buildingBlocks,
}: {
    uiModel: UiModel;
    buildingBlocks: Record<string, EditorBuildingBlock>;
}): JSX.Element {
    const rootUiBlock = useMemo(
        () => ({
            ...canvasRootBlock,
            id: uiModel.id,
            blocks: uiModel.blocks,
        }),
        [uiModel],
    );
    const extendedBuildingBlocks = useMemo(
        () => ({
            ...buildingBlocks,
            [RootBuildingBlock.name]: RootBuildingBlock,
        }),
        [buildingBlocks],
    );

    return (
        <BlockWithChildren
            key={rootUiBlock.id}
            uiBlock={rootUiBlock}
            buildingBlocks={extendedBuildingBlocks}
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
}): JSX.Element {
    const Renderer = buildingBlocks?.[uiBlock.type]?.Renderer;
    const editorCtx = useContext(UiEditorContext);

    if (Renderer == null) {
        throw new Error(
            `can't render block ${JSON.stringify(omit(uiBlock, "blocks"))}`,
        );
    }

    const onActiveElementClick = useCallback(
        (event: React.SyntheticEvent) => {
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();

            if (uiBlock.id !== editorCtx.uiModel?.id) {
                editorCtx.onChange(
                    setActiveElement({
                        uiModel: editorCtx.uiModel as UiModel,
                        activeElement: uiBlock.id,
                    }),
                );
            }
        },
        [uiBlock, editorCtx],
    );

    const uiBlockAttributes = useMemo(
        () => ({
            ...uiBlock.attributes,
            style: {
                ...(uiBlock.attributes.style ?? {}),
                ...(activeElement === uiBlock.id
                    ? {
                          border: "2px solid #2563eb",
                      }
                    : {}),
            },
        }),
        [uiBlock, activeElement],
    );

    return (
        <div
            onClick={onActiveElementClick}
            style={{
                display: "contents",
            }}
        >
            <Renderer
                key={uiBlock.id}
                {...uiBlock}
                attributes={uiBlockAttributes}
            >
                {(uiBlock.blocks ?? []).map((childUiBlock) => (
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

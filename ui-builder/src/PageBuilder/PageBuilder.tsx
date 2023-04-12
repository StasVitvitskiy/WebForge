import React, { useMemo } from "react";
import { UiEditor } from "~/Editor/UiEditor";
import { type UiModel } from "~/Editor/UiModel/UiModel";
import { EmptyPageModel } from "~/PageBuilder/emptyPageModel";
import { HtmlElementBuilderBlock } from "~/Editor/EditorBuildingBlocks/HtmlElementBuildingBlock";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";

export function PageBuilder({
    uiModel = EmptyPageModel,
    onChange,
    buildingBlocks: additionalBuildingBlocks = {},
}: {
    uiModel?: UiModel;
    onChange?: (newModel: UiModel) => void;
    buildingBlocks?: Record<string, EditorBuildingBlock>;
}): JSX.Element {
    const buildingBlocks = useMemo(
        () => ({
            [HtmlElementBuilderBlock.name]: HtmlElementBuilderBlock,
            ...additionalBuildingBlocks,
        }),
        [additionalBuildingBlocks],
    );
    return (
        <UiEditor
            onChange={onChange}
            buildingBlocks={buildingBlocks}
            uiModel={uiModel}
        />
    );
}

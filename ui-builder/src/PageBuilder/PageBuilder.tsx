import React, { useMemo } from "react";
import { UiEditor } from "~/Editor/UiEditor";
import { UiModel } from "~/Editor/UiModel/UiModel";
import { EmptyPageModel } from "~/PageBuilder/emptyPageModel";
import { RootBuildingBlock } from "~/Editor/EditorBuildingBlocks/RootBuildingBlock";
import { HtmlElementBuilderBlock } from "~/Editor/EditorBuildingBlocks/HtmlElementBuildingBlock";

export function PageBuilder({
    uiModel = EmptyPageModel,
    onChange,
}: {
    uiModel?: UiModel;
    onChange?: (newModel: UiModel) => void;
}) {
    const buildingBlocks = useMemo(
        () => ({
            [RootBuildingBlock.name]: RootBuildingBlock,
            [HtmlElementBuilderBlock.name]: HtmlElementBuilderBlock,
        }),
        [],
    );
    return (
        <UiEditor
            onChange={onChange}
            buildingBlocks={buildingBlocks}
            uiModel={uiModel}
        />
    );
}

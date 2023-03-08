import React, { useMemo } from "react";
import { UiEditor } from "~/Editor/UiEditor";
import { UiModel } from "~/Editor/UiModel/UiModel";
import { EmptyPageModel } from "~/PageBuilder/emptyPageModel";
import { RootBuildingBlock } from "~/Editor/EditorBuildingBlocks/RootBuildingBlock";

export function PageBuilder({ uiModel }: { uiModel?: UiModel }) {
    const buildingBlocks = useMemo(
        () => ({
            Root: RootBuildingBlock,
        }),
        [],
    );
    return (
        <UiEditor
            buildingBlocks={buildingBlocks}
            uiModel={uiModel || EmptyPageModel}
        />
    );
}

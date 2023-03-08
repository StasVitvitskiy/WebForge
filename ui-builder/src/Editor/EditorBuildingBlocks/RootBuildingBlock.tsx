import React from "react";
import { EditorBuildingBlock } from "./EditorBuildingBlock";
import { UiModelBuildingBlockAttributes } from "~/Editor/UiModel/UiModelBuildingBlock";

function Renderer({
    children,
    className,
    style,
}: React.PropsWithChildren<UiModelBuildingBlockAttributes>) {
    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
}

export const RootBuildingBlock: EditorBuildingBlock = {
    name: "Root",
    Renderer,
};

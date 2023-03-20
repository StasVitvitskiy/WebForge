import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { getBuildingBlockWrapperStyles } from "~/Editor/Canvas/getBuildingBlockWrapperStyles";

export function Droppable({
    id,
    type,
    name,
    children,
    attributes: { className, style },
}: React.PropsWithChildren<UiModelBuildingBlock>): JSX.Element {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });
    const css = useMemo(
        () => getBuildingBlockWrapperStyles(style ?? {}),
        [style],
    );
    const combinedClassName = useMemo(
        () => `${className} ${isOver ? "border border-blue-600" : ""}`,
        [isOver, className],
    );

    return (
        <div
            data-droppable={type || name}
            ref={setNodeRef}
            className={combinedClassName}
            style={css}
        >
            {children}
        </div>
    );
}

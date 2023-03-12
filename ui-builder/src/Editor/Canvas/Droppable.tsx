import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export function Droppable({
    id,
    children,
    attributes: { className, style },
}: React.PropsWithChildren<UiModelBuildingBlock>): JSX.Element {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });
    const css = useMemo(
        () => ({
            ...style,
        }),
        [],
    );
    const combinedClassName = useMemo(
        () => `${className} ${isOver ? "border border-blue-600" : ""}`,
        [isOver, className],
    );

    return (
        <div ref={setNodeRef} className={combinedClassName} style={css}>
            {children}
        </div>
    );
}

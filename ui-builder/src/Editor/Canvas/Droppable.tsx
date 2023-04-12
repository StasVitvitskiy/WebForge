import React, { type ReactElement } from "react";
import { useDroppable } from "@dnd-kit/core";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export function Droppable({
    id,
    children,
    attributes,
}: React.PropsWithChildren<UiModelBuildingBlock>): JSX.Element {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return React.cloneElement(children as ReactElement, {
        ref: setNodeRef,
        ...attributes,
        style: {
            ...(attributes.style ?? {}),
            ...(isOver
                ? {
                      border: "2px solid #2563eb",
                  }
                : {}),
        },
    });
}

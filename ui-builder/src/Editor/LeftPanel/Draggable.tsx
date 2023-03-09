import React from "react";
import { useDraggable } from "@dnd-kit/core";

export function Draggable({
    children,
    id,
}: React.PropsWithChildren<{ id: string }>) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
    });

    return (
        <button ref={setNodeRef} {...listeners} {...attributes}>
            {children}
        </button>
    );
}

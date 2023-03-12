import React from "react";
import { useDraggable } from "@dnd-kit/core";

export function Draggable({
    children,
    id,
    ...props
}: React.PropsWithChildren<{ id: string }>): JSX.Element {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
    });

    return (
        <button ref={setNodeRef} {...listeners} {...attributes} {...props}>
            {children}
        </button>
    );
}

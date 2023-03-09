import { words } from "lodash";
import React from "react";
import { EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";

export function DraggableBlockFigure({
    block,
}: {
    block: EditorBuildingBlock;
}) {
    const { Icon = () => null } = block;

    return (
        <figure className="flex flex-col content-center items-center cursor-pointer">
            <Icon />
            <figcaption className="py-2">
                {words(block.name).join(" ")}
            </figcaption>
        </figure>
    );
}

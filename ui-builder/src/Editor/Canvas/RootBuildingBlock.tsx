import React from "react";
import { Droppable } from "~/Editor/Canvas/Droppable";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";

const Renderer: EditorBuildingBlock["Renderer"] = ({ children, ...props }) => {
    const {
        attributes: { className, style },
    } = props;

    return (
        <Droppable {...props}>
            <div className={className} style={style}>
                {children}
            </div>
        </Droppable>
    );
};

export const RootBuildingBlock: EditorBuildingBlock = {
    name: "Root",
    Renderer,
};

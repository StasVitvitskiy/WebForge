import React from "react";
import { EditorBuildingBlock } from "./EditorBuildingBlock";
import { Droppable } from "~/Editor/Canvas/Droppable";

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

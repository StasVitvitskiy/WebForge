import { styled } from "@linaria/react";
import React from "react";
import { EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { EditorBuildingBlockGroup } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlockGroup";
import { ImHtmlFive } from "react-icons/im";
import { Droppable } from "~/Editor/Canvas/Droppable";

const Renderer: EditorBuildingBlock["Renderer"] = ({ children, ...props }) => {
    const {
        attributes: {
            tagName = "div",
            className,
            style = {
                height: "200px",
            },
        },
    } = props;

    const elementWithCustomTagName = React.createElement(tagName as string, {
        className,
        style,
        children,
    });

    return <Droppable {...props}>{elementWithCustomTagName}</Droppable>;
};

const Icon = styled(ImHtmlFive)`
    width: 24px;
    height: 24px;
`;

export const HtmlElementBuilderBlock: EditorBuildingBlock = {
    name: "HtmlElement",
    Renderer,
    group: EditorBuildingBlockGroup.Basics,
    Icon,
};

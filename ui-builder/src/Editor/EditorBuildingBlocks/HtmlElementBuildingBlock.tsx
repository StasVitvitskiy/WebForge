import { styled } from "@linaria/react";
import React, { type ReactElement } from "react";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { EditorBuildingBlockGroup } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlockGroup";
import { ImHtmlFive } from "react-icons/im";
import { Droppable } from "~/Editor/Canvas/Droppable";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { HtmlAttributesConfigurationControls } from "~/Editor/ConfigurationControls/HtmlAttributes/HtmlAttributesConfigurationControls";
import { StyleConfigurationControls } from "~/Editor/ConfigurationControls/Style/StyleConfigurationControls";
import { CustomCssAndJsConfigurationControls } from "~/Editor/ConfigurationControls/CustomCssAndJsConfigurationControls";

const Renderer: EditorBuildingBlock["Renderer"] = ({ children, ...props }) => {
    const {
        attributes: { tagName, className, style, ...attributes },
    } = props;

    const elementWithCustomTagName = React.createElement(tagName as string, {
        className,
        style,
        ...attributes,
        children: attributes.customCSS
            ? [
                  ...(children as ReactElement[]),
                  <style
                      key={attributes.customCSS as string}
                      dangerouslySetInnerHTML={{
                          __html: attributes.customCSS as string,
                      }}
                  />,
              ]
            : children,
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
    createUiBlock: (id: string): UiModelBuildingBlock => ({
        id,
        type: HtmlElementBuilderBlock.name,
        attributes: {
            tagName: "div",
            style: {
                height: "200px",
            },
            id,
        },
    }),
    configurationControls: [
        {
            key: "css_styles",
            group: "Style",
            Component: StyleConfigurationControls,
            collapsible: true,
        },
        {
            key: "html_attributes",
            group: "HTML Attributes",
            Component: HtmlAttributesConfigurationControls,
            collapsible: true,
        },
        {
            key: "custom_css_js",
            group: "Custom CSS & JS",
            Component: CustomCssAndJsConfigurationControls,
            collapsible: false,
        },
    ],
};

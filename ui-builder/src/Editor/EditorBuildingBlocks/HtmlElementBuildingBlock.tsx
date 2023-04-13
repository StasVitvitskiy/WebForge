import { styled } from "@linaria/react";
import React, { type ReactElement, useEffect } from "react";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { EditorBuildingBlockGroup } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlockGroup";
import { ImHtmlFive } from "react-icons/im";
import { Droppable } from "~/Editor/Canvas/Droppable";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { HtmlAttributesConfigurationControls } from "~/Editor/ConfigurationControls/HtmlAttributes/HtmlAttributesConfigurationControls";
import { StyleConfigurationControls } from "~/Editor/ConfigurationControls/Style/StyleConfigurationControls";
import { CustomCssAndJsConfigurationControls } from "~/Editor/ConfigurationControls/CustomCssAndJsConfigurationControls";
import { RichTextConfigurationControls } from "~/Editor/ConfigurationControls/RichTextConfigurationControls";
import { omit } from "lodash";
import styleToCSS from "react-style-object-to-css";
import { ErrorBoundary } from "react-error-boundary";
import isSelfClosingTag from "is-self-closing";

const Renderer: EditorBuildingBlock["Renderer"] = ({ children, ...props }) => {
    const {
        attributes: {
            tagName,
            className,
            style,
            customCSS,
            richText,
            customJS,
        },
    } = props;

    const customJsId = `${props.id}-customJS`;
    const enhancedChildren = [
        ...(children as ReactElement[]),
        <style
            key={styleToCSS(style)}
            dangerouslySetInnerHTML={{
                __html: ` [data-block-id="${props.id}"] { ${styleToCSS(
                    style,
                )} } `,
            }}
        />,
        ...(customCSS
            ? [
                  <style
                      key={customCSS as string}
                      dangerouslySetInnerHTML={{
                          __html: customCSS as string,
                      }}
                  />,
              ]
            : []),
        ...(richText
            ? [
                  <span
                      key={richText as string}
                      dangerouslySetInnerHTML={{
                          __html: richText as string,
                      }}
                  />,
              ]
            : []),
        ...(customJS ? [<span id={customJsId} key={customJsId} />] : []),
    ];

    useEffect(() => {
        if (customJS) {
            const script = document.createElement("script");
            script.innerHTML = customJS as string;

            (document.getElementById(customJsId) as Element).innerHTML = "";
            document.getElementById(customJsId)?.appendChild?.(script);
        }
    }, [customJS]);

    const standardAttributes = omit(
        props.attributes,
        HtmlElementBuilderBlock.customAttributes as string[],
    );
    const elementWithCustomTagName = React.createElement(tagName as string, {
        className,
        "data-block-id": props.id,
        ...standardAttributes,
        key: Date.now(),
        ...(isSelfClosingTag(tagName) ? {} : { children: enhancedChildren }),
    });

    if (isSelfClosingTag(tagName)) {
        return (
            // eslint-disable-next-line
            <ErrorBoundary onError={console.error} fallbackRender={() => null}>
                <div
                    style={{
                        display: "contents",
                    }}
                >
                    {elementWithCustomTagName}
                    {enhancedChildren}
                </div>
            </ErrorBoundary>
        );
    }

    return (
        // eslint-disable-next-line
        <ErrorBoundary onError={console.error} fallbackRender={() => null}>
            <Droppable {...props} attributes={standardAttributes}>
                {elementWithCustomTagName}
            </Droppable>
        </ErrorBoundary>
    );
};

const Icon = styled(ImHtmlFive)`
    width: 24px;
    height: 24px;
`;

export const HtmlElementBuilderBlock: EditorBuildingBlock = {
    name: "HtmlElement",
    customAttributes: [
        "customCSS",
        "customJS",
        "richText",
        "richTextMode",
        "tagName",
        "style",
    ],
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
            key: "rich_text_editor",
            group: "Rich text editor",
            Component: RichTextConfigurationControls,
            collapsible: false,
        },
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

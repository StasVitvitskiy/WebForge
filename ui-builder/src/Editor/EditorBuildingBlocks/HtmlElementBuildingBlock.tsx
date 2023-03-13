import { styled } from "@linaria/react";
import React from "react";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { EditorBuildingBlockGroup } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlockGroup";
import { ImHtmlFive } from "react-icons/im";
import { Droppable } from "~/Editor/Canvas/Droppable";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { MdOutlineCodeOff } from "react-icons/md";
import { debounce } from "lodash";

const Renderer: EditorBuildingBlock["Renderer"] = ({ children, ...props }) => {
    const {
        attributes: { tagName, className, style },
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
    createUiBlock: (id: string): UiModelBuildingBlock => ({
        id,
        type: HtmlElementBuilderBlock.name,
        attributes: {
            tagName: "div",
            style: {
                height: "200px",
            },
        },
    }),
    configurationControls: [
        {
            key: "html_attributes",
            group: "HTML Attributes",
            Component: ({ block, onChange }) => {
                return (
                    <>
                        <div>
                            <label
                                htmlFor="tagName"
                                className="block text-sm font-medium leading-6 text-white"
                            >
                                Tag name
                            </label>
                            <div className="mt-2 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-white sm:text-sm">
                                    <MdOutlineCodeOff />
                                </span>
                                <input
                                    type="text"
                                    name="tagName"
                                    id="tagName"
                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="div"
                                    defaultValue={block.attributes.tagName}
                                    onChange={debounce((e) => {
                                        onChange({
                                            ...block,
                                            attributes: {
                                                ...block.attributes,
                                                tagName: e.target.value,
                                            },
                                        });
                                    }, 300)}
                                />
                            </div>
                        </div>
                    </>
                );
            },
        },
    ],
};

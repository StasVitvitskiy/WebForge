import { type UiModel } from "~/Editor/UiModel/UiModel";
import { v4 as uuidv4 } from "uuid";
import { HtmlElementBuilderBlock } from "~/Editor/EditorBuildingBlocks/HtmlElementBuildingBlock";

const sectionBlock = {
    id: uuidv4(),
    type: HtmlElementBuilderBlock.name,
    attributes: {
        tagName: "section" as const,
        style: {
            height: "400px",
        },
    },
    blocks: [],
};

export const EmptyPageModel: UiModel = {
    id: uuidv4(),
    type: "Page",
    attributes: {
        title: "",
        description: "",
    },
    blocks: [sectionBlock],
    activeElement: sectionBlock.id,
};
